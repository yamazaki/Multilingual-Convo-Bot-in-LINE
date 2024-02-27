export class Line {
    private readonly baseUrl = "https://api.line.me";
    private readonly headers: Record<string, string>;
    private messages: Record<string, string>[] = [];

    constructor(accessToken: string) {
        this.headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    }

    public pushTextMessage(
        postMessage: string
    ): void {
        this.messages.push({
            type: "text",
            text: postMessage,
        })
    }

    public pushAudioMessage(
        audioUrl: string,
        autioDuration: string
    ): void {
        this.messages.push({
            type: "audio",
            originalContentUrl: audioUrl,
            duration: autioDuration
        })
    }
    
    public async replyMessage(
        replyToken: string
    ): Promise<void> {

        if (this.messages.length === 0) {
            throw new Error("No message for LINE replyMessage");
        }

        await fetch(`${this.baseUrl}/v2/bot/message/reply`,{
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                replyToken: replyToken,
                messages: this.messages,
            }),
        }).catch((err) => {
            console.log(`LINE API Error: ${err}`);
        });
    }

    public async replySingleTextMessage(
        postMessage: string,
        replyToken: string
    ): Promise<void> {
        this.pushTextMessage(postMessage)
        await this.replyMessage(replyToken)
    }

}