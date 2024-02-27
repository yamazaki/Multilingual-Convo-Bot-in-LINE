import GoogleAuth, { GoogleKey } from 'cloudflare-workers-and-google-oauth'

import { 
    speechSex,
    audioSpeakingRate,
    autioPitch,
    autioVolumeGainDb
} from './prompt';
import { getSpeechName } from './lang-speech';

interface TextToSpeechResponse {
    audioContent: string;
}

export async function getGoogleAuthToken(
    authKey: string
): Promise<string> {

    const scopes: string[] = ['https://www.googleapis.com/auth/cloud-platform'];
	const googleAuth: GoogleKey = JSON.parse(authKey);
    const oauth = new GoogleAuth(googleAuth, scopes);
    const authToken = await oauth.getGoogleAuthToken();

    if ( authToken === undefined ) {
        throw new Error(`Can't get Google Auth Token`);
    }
    //console.log(`Google Auth Token: ${authToken}`);
    return authToken;
}

export class GoogleTtsClient {
    private readonly ttsUrl = "https://texttospeech.googleapis.com/v1/text:synthesize";
    private readonly headers: Record<string, string>;

    constructor(authToken: string) {
        this.headers = {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json; charset=utf-8",
        };
    }

    public async generateSpeech(
        messages: string,
        langCode: string
    ): Promise<ArrayBuffer> {

        // 音声の個別指定
        const speechName = getSpeechName( langCode );
        const commonVoiceParam = {
            languageCode: langCode,
            ssmlGender: speechSex,
        };
        const voiceParam = speechName 
        ? {
            ...commonVoiceParam,
            name: speechName
        } : commonVoiceParam;
            
        const data = JSON.stringify({
            input: {
                text: messages,
            },
            voice: voiceParam,
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: audioSpeakingRate,
                pitch: autioPitch,
                volumeGainDb: autioVolumeGainDb
            },
        });
        //console.log(`Google API Request Headers: ${JSON.stringify(this.headers)}`);
        console.log(`Google API Request Data: ${data}`);

        try {
            const response = await fetch(`${this.ttsUrl}`, {
                method: "POST",
                headers: this.headers,
                body: data,
            });
    
            if (!response.ok) {
                throw new Error(`Speech API responded with status ${response.status}`);
            }

            const respData = await response.json() as TextToSpeechResponse;

            if ( respData.audioContent ) {
              // base64エンコードされた音声データをArrayBufferにデコード
              const audioBuffer = Buffer.from(respData.audioContent, 'base64');
              return audioBuffer;
            } else {
              throw new Error('No audio content received');
            }

        } catch (err) {
            console.error(`Google Text-to-Speech API Error: ${err}`);
            throw err;
        }
    }
}