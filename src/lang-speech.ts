export const speechNames: { [key: string]: string } = {
    "af-ZA": "",
    "ar-XA": "",
    "eu-ES": "",
    "bn-IN": "",
    "bg-BG": "",
    "ca-ES": "",
    "yue-HK": "",
    "cs-CZ": "",
    "da-DK": "",
    "nl-BE": "",
    "nl-NL": "",
    "en-AU": "",
    "en-IN": "",
    "en-GB": "",
    "en-US": "",
    "fil-PH": "",
    "fi-FI": "",
    "fr-CA": "",
    "fr-FR": "",
    "gl-ES": "",
    "de-DE": "",
    "el-GR": "",
    "gu-IN": "",
    "he-IL": "",
    "hi-IN": "",
    "hu-HU": "",
    "is-IS": "",
    "id-ID": "",
    "it-IT": "",
    "ja-JP": "",
    "kn-IN": "",
    "ko-KR": "",
    "lv-LV": "",
    "lt-LT": "",
    "ms-MY": "",
    "ml-IN": "",
    "cmn-CN": "",
    "cmn-TW": "",
    "mr-IN": "",
    "nb-NO": "",
    "pl-PL": "",
    "pt-BR": "",
    "pt-PT": "",
    "pa-IN": "",
    "ro-RO": "",
    "ru-RU": "",
    "sr-RS": "",
    "sk-SK": "",
    "es-ES": "",
    "sv-SE": "",
    "ta-IN": "",
    "te-IN": "",
    "th-TH": "",
    "tr-TR": "",
    "uk-UA": "",
    "vi-VN": "",    
};

export function getSpeechName(langCode: string): string {

    let speechName = speechNames[langCode];

    if (speechName === undefined || speechName === "") {
        console.log("Not match speechName for:", langCode);
        speechName = "";
    }

    return speechName;
}