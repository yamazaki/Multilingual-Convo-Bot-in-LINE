type ChatCompletionMessageRequest = {
    role: "system" | "user" | "assistant";
    content: string;
}

type ChatCompletionMessageResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
};
  
type Choice = {
    index: number;
    message: Message;
    finish_reason: string;
};

type Message = {
    role: string;
    content: string;
};
  
type Usage = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
};

import { 
    systemPromptOfBotPersonality,
    promptOfDetermineTheContextOfTranslation,
    promptOfDetermineTheContextOfTranslationRequestType,
    promptOfDetermineTheContextOfSwitchLanguage,
    promptOfPickupLanguage,
    promptForRequestingTranslation,
    promptForRequestingInMultilingual,
    gptModel,
    speechModel,
    speechVoice,
    speechSpeed,
} from "./prompt";

import { 
    Conversation 
} from "./tables";

export class OpenAIClient {
    private readonly baseUrl = "https://api.openai.com";
    private readonly headers: Record<string, string>;

    constructor(apiKey: string) {
        this.headers = {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        };
    }

    private async generateMessage(
        model: string,
        messages: Array<ChatCompletionMessageRequest>,
        temperature: number
    ): Promise<string | undefined> {

        const data = JSON.stringify({
            model: model,
            messages: messages,
            temperature: temperature,
        });
        
        const apiResp = await fetch(`${this.baseUrl}/v1/chat/completions`, {
                method: "POST",
                headers: this.headers,
                body: data,
            }
        )
        .then(
            (res) => res.json() as Promise<ChatCompletionMessageResponse> 
        )
        .catch(
            (err) => {
                console.log(`OpenAI API Error: ${err}`);
                return null;
            }
        );

        if ( apiResp && apiResp.error ) {
            console.log(apiResp.error.message);
            if ( apiResp.error.type === 'insufficient_quota' ) {
                //return "有料APIのクレジット残高がなくなりましたので課金が必要です";
                throw new Error("OpenAI API: The credit balance for the paid API has run out and you need to pay for it. \n " + apiResp.error.message);
            }
        }

        return apiResp?.choices[0].message.content;
    }

    public async generateMessageWithConversationHistory(
        conversationHistory: Conversation[],
        postedUserMessage: string,
        langInEnglish: string
    ): Promise<string | undefined> {
        
        const messages: Array<ChatCompletionMessageRequest> = [
            ...systemPromptOfBotPersonality(langInEnglish)
        ];

        for (const conversations of conversationHistory.reverse()) {            
            messages.push({
                role: "user",
                content: conversations.user_message
            });
            if ( conversations.bot_message != "" && conversations.bot_message != null ) {
                messages.push({
                    role: "assistant",
                    content: conversations.bot_message
                });
            }
        }
        
        messages.push(promptForRequestingInMultilingual(postedUserMessage));
        
        return await this.generateMessage(gptModel, messages, 1.2);
    }

    public async isRequestingTranslation (
        postedUserMessage: string
    ): Promise<boolean> {
        const messages: Array<ChatCompletionMessageRequest> = promptOfDetermineTheContextOfTranslation(
            postedUserMessage
        );

        const isRequested = await this.generateMessage(gptModel, messages, 0.2);

        if (isRequested == "YES") {
            return true;
        } else {
            return false;
        }
    }

    public async whichRequestType (
        postedUserMessage: string
    ): Promise<string> {
        const messages: Array<ChatCompletionMessageRequest> = promptOfDetermineTheContextOfTranslationRequestType(
            postedUserMessage
        );

        const requestType = await this.generateMessage(gptModel, messages, 0.2);
        return requestType !== undefined ? requestType : "";

    }

    public async isRequestingSwitchingLang (
        postedUserMessage: string
    ): Promise<boolean> {
        const messages: Array<ChatCompletionMessageRequest> = promptOfDetermineTheContextOfSwitchLanguage(
            postedUserMessage
        );

        const isRequested = await this.generateMessage(gptModel, messages, 0.2);
        console.log("言語切替 : " + isRequested);

        if (isRequested == "YES") {
            return true;
        } else {
            return false;
        }
    }

    public async generateMessageForTranslation(
        postedUserMessage: string
    ): Promise<string | undefined> {
        const messages: Array<ChatCompletionMessageRequest> = promptForRequestingTranslation(
            postedUserMessage
        );

        return await this.generateMessage(gptModel, messages, 1.2);
    }

    public async generateMessageForPickupLang(
        postedUserMessage: string
    ): Promise<string | undefined> {
        const messages: Array<ChatCompletionMessageRequest> = promptOfPickupLanguage(
            postedUserMessage
        );

        return await this.generateMessage(gptModel, messages, 1.0);
    }

    public async generateSpeech(
        messages: string
    ): Promise<ArrayBuffer> {

        const data = JSON.stringify({
            model: speechModel,
            input: messages,
            voice: speechVoice,
            response_format: "mp3",
            speed: speechSpeed,
        });

        try {
            const response = await fetch(`${this.baseUrl}/v1/audio/speech`, {
                method: "POST",
                headers: this.headers,
                body: data,
            });
    
            if (!response.ok) {
                throw new Error(`Speech API responded with status ${response.status}`);
            }
    
            const buffer = await response.arrayBuffer();
            return buffer;

        } catch (err) {
            console.error(`OpenAI API Error: ${err}`);
            throw err;
        }
    }
}