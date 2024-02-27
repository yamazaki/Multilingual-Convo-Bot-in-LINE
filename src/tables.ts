export type Conversation = {
    id: number;
    user_id: string;
    group_id: string;
    user_message: string;
    bot_message: string;
}

export type Personalise = {
    id: number;
    user_o_group_id: string;
    talk_lang: string;
    output_style: string;
}