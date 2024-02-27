export const languageCodes: { [key: string]: string } = {
    "アフリカーンス語": "af-ZA",
    "アラビア語": "ar-XA",
    "バスク語": "eu-ES",
    "ベンガル語": "bn-IN",
    "ブルガリア語": "bg-BG",
    "カタルーニャ語": "ca-ES",
    "広東語": "yue-HK",
    "チェコ語": "cs-CZ",
    "デンマーク語": "da-DK",
    "ベルギーオランダ語": "nl-BE",
    "オランダ語": "nl-NL",
    "オーストラリア英語": "en-AU",
    "インド英語": "en-IN",
    "イギリス英語": "en-GB",
    "英語": "en-US",
    "フィリピン語": "fil-PH",
    "フィンランド語": "fi-FI",
    "カナダフランス語": "fr-CA",
    "フランス語": "fr-FR",
    "ガリシア語": "gl-ES",
    "ドイツ語": "de-DE",
    "ギリシャ語": "el-GR",
    "グジャラト語": "gu-IN",
    "ヘブライ語": "he-IL",
    "ヒンディー語": "hi-IN",
    "ハンガリー語": "hu-HU",
    "アイスランド語": "is-IS",
    "インドネシア語": "id-ID",
    "イタリア語": "it-IT",
    "日本語": "ja-JP",
    "カンナダ語": "kn-IN",
    "韓国語": "ko-KR",
    "ラトビア語": "lv-LV",
    "リトアニア語": "lt-LT",
    "マレー語": "ms-MY",
    "マラヤーラム語": "ml-IN",
    "中国語": "cmn-CN",
    "台湾語": "cmn-TW",
    "マラーティー語": "mr-IN",
    "ノルウェー語": "nb-NO",
    "ポーランド語": "pl-PL",
    "ブラジルポルトガル語": "pt-BR",
    "ポルトガル語": "pt-PT",
    "パンジャブ語": "pa-IN",
    "ルーマニア語": "ro-RO",
    "ロシア語": "ru-RU",
    "セルビア語": "sr-RS",
    "スロバキア語": "sk-SK",
    "スペイン語": "es-ES",
    "スウェーデン語": "sv-SE",
    "タミル語": "ta-IN",
    "テルグ語": "te-IN",
    "タイ語": "th-TH",
    "トルコ語": "tr-TR",
    "ウクライナ語": "uk-UA",
    "ベトナム語": "vi-VN",
};

export function getLangCode(lang: string): string | undefined {

    let langCode = languageCodes[lang];

    if (langCode === undefined) {
        console.log("Not match langCode for:", lang);
    }

    return langCode;
}