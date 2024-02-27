import { defaultTalkLang } from './prompt';

export const languageInEnglish: { [key: string]: string } = {
    "アフリカーンス語": "Afrikaans",
    "アラビア語": "Arabic",
    "バスク語": "Basque",
    "ベンガル語": "Bengali",
    "ブルガリア語": "Bulgarian",
    "カタルーニャ語": "Catalan",
    "広東語": "Cantonese",
    "チェコ語": "Czech",
    "デンマーク語": "Danish",
    "ベルギーオランダ語": "Dutch (Belgium)",
    "オランダ語": "Dutch (Netherlands)",
    "オーストラリア英語": "English (Australia)",
    "インド英語": "English (India)",
    "イギリス英語": "English (UK)",
    "英語": "English (US)",
    "フィリピン語": "Filipino",
    "フィンランド語": "Finnish",
    "カナダフランス語": "French (Canada)",
    "フランス語": "French (France)",
    "ガリシア語": "Galician",
    "ドイツ語": "German",
    "ギリシャ語": "Greek",
    "グジャラト語": "Gujarati",
    "ヘブライ語": "Hebrew",
    "ヒンディー語": "Hindi",
    "ハンガリー語": "Hungarian",
    "アイスランド語": "Icelandic",
    "インドネシア語": "Indonesian",
    "イタリア語": "Italian",
    "日本語": "Japanese",
    "カンナダ語": "Kannada",
    "韓国語": "Korean",
    "ラトビア語": "Latvian",
    "リトアニア語": "Lithuanian",
    "マレー語": "Malay",
    "マラヤーラム語": "Malayalam",
    "中国語": "Mandarin (China)",
    "台湾語": "Mandarin (Taiwan)",
    "マラーティー語": "Marathi",
    "ノルウェー語": "Norwegian",
    "ポーランド語": "Polish",
    "ブラジルポルトガル語": "Portuguese (Brazil)",
    "ポルトガル語": "Portuguese (Portugal)",
    "パンジャブ語": "Punjabi",
    "ルーマニア語": "Romanian",
    "ロシア語": "Russian",
    "セルビア語": "Serbian",
    "スロバキア語": "Slovak",
    "スペイン語": "Spanish",
    "スウェーデン語": "Swedish",
    "タミル語": "Tamil",
    "テルグ語": "Telugu",
    "タイ語": "Thai",
    "トルコ語": "Turkish",
    "ウクライナ語": "Ukrainian",
    "ベトナム語": "Vietnamese",    
};

export function getLangInEnglish(lang: string): string | undefined {

    let langInEn = languageInEnglish[lang];

    if (langInEn === undefined) {
        console.log("Not match lang in English for:", lang);
        langInEn = languageInEnglish[defaultTalkLang];
    }

    return langInEn;
}