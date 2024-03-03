import { TextEventMessage, WebhookEvent } from '@line/bot-sdk';
import * as mm from "music-metadata";
import { Hono } from 'hono';
import { Line } from './line';
import { OpenAIClient } from './openai';
import { GoogleTtsClient, getGoogleAuthToken} from './google-tts';
import { Conversation, Personalise } from './tables';
import { getUnixTimeInSeconds } from './utils';
import { getLangCode } from './lang-code';
import { getLangInEnglish } from './lang-in-en';
import { 
    defaultTalkLang,
    botNames,
    SIMULTANEOUS_TRANSLATION,
    NO_SIMULTANEOUS_TRANSLATION,
    INTERPRETATION_REQUEST,
    CONVERSATION_REQUEST,
    responseFrequency,
    speechType
} from './prompt';


type Bindings = {
    DB: D1Database;
    BUCKET: R2Bucket;
    R2_SPEECH_KV: KVNamespace;
    WORKERS_SITE_DOMAIN: string;
    CHANNEL_ACCESS_TOKEN: string;
    OPENAI_API_KEY: string;
    GCP_SERVICE_ACCOUNT_AUTH_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/webhook', async (c) => {
    const data = await c.req.json()
    const events: WebhookEvent[] = (data as any).events
    
    const event = events
        .map((event: WebhookEvent) => {
            if (event.type != "message" || event.message.type != "text") {
                return;
            }
            return event
        })
        .filter((event) => event)[0]

    if ( !event ) {
        console.log(`No event: ${events}`)
        return c.json({ message: "OK" })
    }   

    const replyToken = event.replyToken;
    const userId = event.source.userId !== undefined ? event.source.userId : "";
    const groupId = event.source.groupId !== undefined ? event.source.groupId : "";
    const sourceType = event.source.type !== undefined ? event.source.type : "";
    const postedUserMessage = (event.message as TextEventMessage).text;

    const continueConversation = continueAutoReply(sourceType, postedUserMessage);

    c.executionCtx.waitUntil( 
        replyGeneratedMessage(
            c.env, 
            userId, 
            sourceType,
            groupId,
            postedUserMessage, 
            continueConversation, 
            replyToken
    ));

    return c.json({ message: "ok"})
})

app.get('/speech/:key', async (c) => {
    const key = c.req.param('key');
    
    const object = await c.env.BUCKET.get(key);
    if (!object) return c.notFound();
    const data = await object.arrayBuffer();

    const maxAge = 60 * 60 * 24 * 30; // 30 days

    return c.body(
        data,
        200,
        {
            'Cache-Control': `public, max-age=${maxAge}`,
            'Content-Type': 'audio/mpeg'
        }
    )

})

function continueAutoReply(sourceType: string, message: string): boolean {
    
    if ( sourceType == "user") {
        //1:1のDM
        return true;
    } else if ( containsBotName(message) ) {
        //Botが話題になっている
        return true;
    } else {
        // 0から4の範囲でランダムな整数を生成 = 5回に1回の確率 * 5
        // 0から9の範囲でランダムな整数を生成 = 10回に1回の確率 * 10
        const randomNumber = Math.floor(Math.random() * responseFrequency);

        // この場合、randomNumberが0のときだけtrueを返す
        return randomNumber === 0;
    }
}

function containsBotName(message: string): boolean {
    
    const lowerMessage = message.toLowerCase(); //英字の大小を同一に扱うため

    return botNames.some(name => lowerMessage.includes(name.toLowerCase()));
}

async function replyGeneratedMessage(
    env: Bindings,
    userId: string, 
    sourceType: string, 
    groupId: string, 
    postedUserMessage: string, 
    continueConversation: boolean,
    replyToken: string
) {
    try {
        const openaiClient = new OpenAIClient(env.OPENAI_API_KEY);

        if ( await openaiClient.isRequestingSwitchingLang(postedUserMessage) )
            await setTalkLang(env, userId, groupId, sourceType, postedUserMessage);
        
        const requestType = await openaiClient.whichRequestType(postedUserMessage);
        console.log("requestType : " + requestType);

        if ( requestType == SIMULTANEOUS_TRANSLATION || requestType == NO_SIMULTANEOUS_TRANSLATION )
            await setOutputStyle(env, userId, groupId, sourceType, requestType);
        
        if ( !continueConversation ) {
            if ( sourceType = "group" ){
                await saveGroupMessageHistory(env, groupId, postedUserMessage);
            }
            console.log("Not continue the conversation...")
        } else {
            const [talkLang, outputSytle] = await getPersonalise(env, userId, groupId, sourceType);
            console.log(talkLang + ":" + outputSytle);    

            const generatedMessage = await generateMessageAndSaveHistory(
                env, 
                sourceType,
                userId, 
                groupId,
                postedUserMessage, 
                talkLang);
            console.log(generatedMessage);

            const [key, duration] = await generateSpeech(env, generatedMessage, talkLang);
            const autioUrl = `https://${env.WORKERS_SITE_DOMAIN}/speech/` + key
            
            const lineClient = new Line(env.CHANNEL_ACCESS_TOKEN);
            lineClient.pushTextMessage(generatedMessage);
            lineClient.pushAudioMessage(autioUrl, duration);
            
            if ( outputSytle == SIMULTANEOUS_TRANSLATION) {
                const translatedMessage = await generateMessageForTranslation(env, generatedMessage);
                console.log(translatedMessage);

                lineClient.pushTextMessage(translatedMessage);
            }
            
            await lineClient.replyMessage(replyToken);
        }
    } catch (err: unknown) {
        if (err instanceof Error) console.log(err);
        const lineClient = new Line(env.CHANNEL_ACCESS_TOKEN);
        await lineClient.replySingleTextMessage("(不具合発生中) 少し経ってから再度試してみてください！ \n" + err, replyToken);
    }
}

async function generateMessageForTranslation(
    env: Bindings, 
    postedUserMessage: string
) {
    const openaiClient = new OpenAIClient(env.OPENAI_API_KEY);
    const generatedMessage = await openaiClient.generateMessageForTranslation(
        postedUserMessage
    );
    
    if (!generatedMessage || generatedMessage === "") 
        throw new Error("No message generated for Translation");

    return generatedMessage;
}

async function setTalkLang(
    env: Bindings, 
    userId: string, 
    groupId: string, 
    sourceType: string, 
    postedUserMessage: string
) {
    const openaiClient = new OpenAIClient(env.OPENAI_API_KEY)
    const requestLang = await openaiClient.generateMessageForPickupLang(postedUserMessage)
    console.log("切替言語 : " + requestLang)

    // id for User
    let id = sourceType + "-" + userId;
    if ( sourceType == "group" ) {
        // id for Group
        id = sourceType + "-" + groupId;
    }

    if (!requestLang || requestLang === "") 
        throw new Error("Miss Request Language")

    await env.DB.prepare(
        `INSERT INTO personalise (user_o_group_id, talk_lang, output_style) VALUES (?, ?, ?) ON CONFLICT(user_o_group_id) DO UPDATE SET talk_lang = ?`
    )
    .bind(
        id,
        requestLang,
        SIMULTANEOUS_TRANSLATION,
        requestLang
    )
    .run()

    return requestLang;
}

async function setOutputStyle(
    env: Bindings, 
    userId: string, 
    groupId: string, 
    sourceType: string, 
    requestType: string
) {

    // id for User
    let id = sourceType + "-" + userId;
    if ( sourceType == "group" ) {
        // id for Group
        id = sourceType + "-" + groupId;
    }

    await env.DB.prepare(
        `INSERT INTO personalise (user_o_group_id, talk_lang, output_style) VALUES (?, ?, ?) ON CONFLICT(user_o_group_id) DO UPDATE SET output_style = ?`
    )
    .bind(
        id,
        defaultTalkLang,
        requestType,
        requestType
    )
    .run()

    console.log("setOutputStyle : " + defaultTalkLang + ", " + requestType);

    return requestType;
}

async function getPersonalise(
    env: Bindings, 
    userId: string, 
    groupId: string, 
    sourceType: string, 
): Promise<string[]> {

    // id for User
    let id = sourceType + "-" + userId;
    if ( sourceType == "group" ) {
        // id for Group
        id = sourceType + "-" + groupId;
    }

    const personaliseInfo = await env.DB.prepare(
        `SELECT talk_lang, output_style from personalise WHERE user_o_group_id = ?`
    ).bind(
        id
    ).first<Personalise>()

    if (!personaliseInfo || personaliseInfo == null ) {
        return [ defaultTalkLang, SIMULTANEOUS_TRANSLATION ];
    } else {
        return [ personaliseInfo.talk_lang, personaliseInfo.output_style ];
    }
}

async function saveGroupMessageHistory(
    env: Bindings, 
    groupId: string, 
    postedUserMessage: string
) {
    await env.DB.prepare(
        `INSERT INTO conversations (group_id, user_message) values (?, ?)`
    )
    .bind(
        groupId,
        postedUserMessage
    )
    .run()
}

async function generateMessageAndSaveHistory(
    env: Bindings,
    sourceType: string, 
    userId: string, 
    groupId: string, 
    postedUserMessage: string,
    talklang: string
) {
    // for User
    let id = userId;
    let selectSql = `SELECT * from conversations WHERE user_id = ? order by id desc limit 15`;
    let insertSql = `INSERT INTO conversations (user_id, user_message, bot_message) values (?, ?, ?)`;

    if ( sourceType == "group" ) {
        id = groupId;
        selectSql = `SELECT * from conversations WHERE group_id = ? order by id desc limit 15`;
        insertSql = `INSERT INTO conversations (group_id, user_message, bot_message) values (?, ?, ?)`;
    }

    const { results: conversationHistory } = await env.DB.prepare(
        selectSql
    ).bind(
        id
    ).all<Conversation>()

    const langInEnglish = getLangInEnglish(talklang);
    const openaiClient = new OpenAIClient(env.OPENAI_API_KEY);
    const generatedMessage = await openaiClient.generateMessageWithConversationHistory(
        conversationHistory, 
        postedUserMessage,
        langInEnglish
    );

    if (!generatedMessage || generatedMessage === "") 
        throw new Error("No message generated")

    await env.DB.prepare(
        insertSql
    )
    .bind(
        id,
        postedUserMessage,
        generatedMessage
    )
    .run()

    return generatedMessage
}

async function generateSpeech(
    env: Bindings, 
    message: string,
    talkLang: string
) {
    const speechBuffer = await generateSpeechBuffer(env, message, talkLang);
    
    const key = getUnixTimeInSeconds() + ".mp3" ;
    await env.BUCKET.put(key, speechBuffer);

    const metadata = await mm.parseBuffer(new Uint8Array(speechBuffer), 'audio/mpeg');
    const durationInMilliseconds = Math.round(metadata.format.duration * 1000);

    return [key, durationInMilliseconds.toString()];
}

async function generateSpeechBuffer(
    env: Bindings, 
    message: string,
    talkLang: string
) {
    
    if ( speechType == "OpenAI" ) {
        const openaiClient = new OpenAIClient(env.OPENAI_API_KEY);
        return await openaiClient.generateSpeech(message);
    
    } else if ( speechType == "Google" ) {

        const langCode = getLangCode(talkLang);

        if ( langCode === undefined ) {
            // execute OpenAI because not match langCode = Not support language in Google TTS
            const openaiClient = new OpenAIClient(env.OPENAI_API_KEY);
            return await openaiClient.generateSpeech(message);    
        } else {
            // Google Text-to-speech
            const authToken = await getGoogleAuthToken(env.GCP_SERVICE_ACCOUNT_AUTH_KEY);
            const googleTtsClient = new GoogleTtsClient(authToken);
            return await googleTtsClient.generateSpeech(message, langCode);
        }
    }
}

export default app
