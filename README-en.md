# Multilingual Convo Bot in LINE

![LINE_AI_Bot_Title_Logo](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/assets/34241/00cb05d5-1d0c-44f7-ac3a-94d834a91bfa)

[日本語 README](./README.md)

## About the creation and publication of this program

I started developing this program because I thought that if generative AI such as ChatGPT could be used naturally on LINE, even non-IT family members (especially children) could easily come into contact with AI.

I am not a professional programmer, so please consider the quality of the source code to be at an amateur level.

I proceeded with the implementation by referring to other people's blog entries and public sources listed in the Acknowledgments section, and expanded and customized the program by incorporating my own ideas.

I hope that by making the source code public, it will be helpful for those who want to use LINE to get familiar with generative AI like me, or those who are interested in the elemental technology used.

## Overview

This program is an AI bot that uses the API of OpenAI (ChatGPT), which enables multilingual conversational communication on LINE.

As the name suggests, it is multilingual, and you can enjoy conversations not only in English but also in less than 60 languages ​​supported by the ChatGPT/OpenAI API as of February 2024.

Typical AI bots respond in Japanese to Japanese posts and in English to English posts, but this AI bot responds in a pre-specified language regardless of the language of the message posted by the user. In addition to responding with , you can also tell them to switch languages ​​in the middle of a conversation.

This means that even if the user continues to speak to them in Japanese, the AI ​​bot will continue to respond in English or French.

In addition, when communicating on LINE, responses will be supplemented with the conversation in the specified language, along with the audio of the conversation and translation of broken japanese.

You can use it to strengthen your listening skills by listening to the audio, and to practice speaking by imitating the pronunciation of the audio (shadowing). Even if you are in the middle of learning the specified language and are unfamiliar with it, you can use it while looking at the Japanese translation that is included. You can have smooth conversations.

In addition to one-on-one conversations, you can also have the AI ​​bot join a LINE group, so for example, by inviting the AI ​​bot to your family's LINE group, the AI ​​bot will occasionally intervene in conversations between family members. You can also enjoy it like this.

When an AI bot joins a LINE group, it is possible to adjust the response frequency, such as having the AI ​​bot perform automatic responses at a rate of 1 in 10.

The AI ​​bot retains the conversation history for a certain period of time, so it responds based on continuous conversations.

## 利用技術

- Cloudflare Workers
- Cloudflare R2
- Cloudflare D1
- Hono
- TypeScript
- OpenAI API
- Google Cloud Text-to-Speech API

The official LINE account (bot) that uses the Messaging API runs on Cloudflare Workers, and the generation of conversation text messages uses OpenAI's API, which has the same functionality as ChatGPT.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fworkers%2F)](https://developers.cloudflare.com/workers/)

The framework uses Hono, which is developed from Japan and runs on Cloudflare Workers.

[![Hono](https://img.shields.io/github/stars/honojs/hono?style=for-the-badge&logo=hono&label=Hono&link=https%3A%2F%2Fgithub.com%2Fhonojs%2Fhono)](https://github.com/honojs/hono)
[![TypeScript](https://img.shields.io/badge/TypeScript-2762ba?style=for-the-badge&logo=typescript&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://www.typescriptlang.org/)

For audio data generation, in addition to OpenAI's Text-to-speech (TTS), you can also switch to Google Cloud's TTS. Google's TTS allows you to specify gender and change the pitch of your voice, so you can make detailed adjustments according to your preferences.

[![OpenAI API](https://img.shields.io/badge/OpenAI_API-229972?style=for-the-badge&logo=openai&link=https%3A%2F%2Fplatform.openai.com%2Fdocs%2Fapi-reference)](https://platform.openai.com/docs/api-reference)
[![Google Cloud Text-to-Speech API](https://img.shields.io/badge/Google_Cloud_API_TTS-4d5055?style=for-the-badge&logo=google&link=https%3A%2F%2Fcloud.google.com%2Ftext-to-speech)](https://cloud.google.com/text-to-speech)

It use Cloudflare R2 object storage to store voice data, and Cloudflare D1 to store conversation history.

[![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fr2%2F)](https://developers.cloudflare.com/r2/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fd1%2F)](https://developers.cloudflare.com/d1/)

## Advance preparation

In order for the setup to proceed smoothly, the following preparations are required.

- Create a Cloudflare account
- Create an OpenAI account and get the API secret key
- Create a LINE account and log in to the LINE Developers console
- Create a LINE official account for Messaging API and get the channel access token

If you want to use Google Cloud's Text-to-Speech (TTS), you will also need to make the following preparations.

- Create a Google account
- Login to Google Cloud console
- Get the service account key for GOogle Cloud Text-to-Speech API

I will not explain the details of advance preparation on this page. If you search, you will find a lot of information on the internet, so please refer to it as you prepare.

Below, I will provide links to the necessary access points for preparation.

### Cloudflare

Create a Cloudflare account.
 * [Create an account · Getting started · Learning paths](https://developers.cloudflare.com/learning-paths/get-started/account-setup/create-account/)

### OpenAI

If you have a ChatGPT account, you can use it. If you do not have an OpenAI account yet, you can create one by clicking "Sing up" below.
 * [OpenAI API](https://openai.com/blog/openai-api)

Get the API secret key below.
 * [API keys - OpenAI API](https://platform.openai.com/api-keys )

Please also refer to the following regarding handling of keys.
 * [Best Practices for API Key Safety | OpenAI Help Center](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)

### LINE

You can log in to the LINE Developer console using your personal LINE account. Create a "provider" when you log in for the first time.
 * [Log in to LINE Developers | LINE Developers](https://developers.line.biz/en/docs/line-developers-console/login-account/)

Creating a LINE official account using the Messaging API is equivalent to setting up a "channel" within the "provider".
 * [Get started with the Messaging API | LINE Developers](https://developers.line.biz/en/docs/messaging-api/getting-started/)

When creating a channel, prepare an image for your account icon or a background image for your profile so that it will look better when you access your official account on the LINE app.

To create icons and background images, it would be a good idea to use an image generation AI service like the one below.

- [OpenAI DALL·E 2](https://openai.com/dall-e-2)
- [DreamStudio by stability.ai](https://beta.dreamstudio.ai/generate)
- [Canva Magic Media](https://www.canva.com/)

DALL has a monthly limit on the number of images that can be created, and DreamStudio and Canva issue free credits when creating an account, and you can generate images for free if you use the credits.

Get the channel access token to use the Messaging API.
 * [Issue channel access token v2.1 | LINE Developers](https://developers.line.biz/en/docs/messaging-api/generate-json-web-token/)

Additional settings are required to invite/participate in a LINE official account to a group talk.
 * [Group chats and multi-person chats | LINE Developers](https://developers.line.biz/en/docs/messaging-api/group-chats/#add-bot-group-room)

### Google Cloud

Log in to the Google Cloud console using your Google account.
 * [Google Cloud console - Web UI Admin](https://cloud.google.com/cloud-console?hl=en)

Enable Text-to-Speech API.
 * [Before You Begin  |  Cloud Text-to-Speech API  |  Google Cloud](https://cloud.google.com/text-to-speech/docs/before-you-begin?hl=en)

Get the service account key in JSON format.
 * [Create and delete service account keys  |  IAM のドキュメント  |  Google Cloud](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=en)

## Settings and Installation

The general flow is as follows.

1. Clone source code from repository to local environment
2. Adding and editing files required for operations that are not included in the repository
3. Setting constants and variables that determine the behavior of LINE bot and editing prompts
4. Package installation in local environment
5. Creating a new bucket in Cloudflare R2
6. Creating a new database and schema for Cloudflare D1
7. Setting environment variables
8. Deployment and operation check
9. Messaging API webhook URL settings for LINE official account

### Clone a repository

I recommend that you fork this repository so that you can manage the editing history of your own source code.
 * [Fork a repository - GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

Move to a suitable directory in your local environment and clone from the forked repository.

```bash
cd ~/Development/LINE-Bot
git clone https://github.com/YOUR_ACCOUNT/Multilingual-Convo-Bot-in-LINE.git ./
```

### Add file wrangler.toml

Add the `wrangler.toml` file directly under the repository.

```bash
name = "multilingual-convo-bot-in-line"
compatibility_date = "2023-01-01"
node_compat = true

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "speech-audio"

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "convo-db"
database_id = "***"
```

- name … Cloudflare Workers project name, used for the subdomain of the endpoint (URL).
- node_compat … Enable the flags required to use the library `music-metadata` that analyzes the length of audio files.
    - [Configuration ​​#Add polyfills using Wrangler - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/configuration/#add-polyfills-using-wrangler)
・database_id... Execute the command to create a DB and output the ID displayed on the standard output.

### Setting constants and variables and editing prompts src/prompt.ts

Rename the file name of `src/prompt.ts.sample`, which is included in the repository as a sample, to `src/prompt.ts`.

Among the defined items, constants in all uppercase letters (e.g. `SIMULTANEOUS_TRANSLATION`) are fixed items that do not need to be changed even if the environment changes for each user.

The `prompt*` prompt variable usually does not need to be changed, but it is possible to modify the tuning to improve output accuracy. However, please edit it so that it does not affect the basic behavior or output results.

Please feel free to change constants and variables other than those listed above according to your environment and preferences.

This is an explanation table of each definition item.

| Definition items | Setting details |
| --- | --- |
| defaultTalkLang | Specify one default language in Japanese<br>e.g. 英語 / フランス語 / スペイン語  |
| botNames | Specify the character name of the LINE bot in Japanese, English, or multiple nicknames (array)<br>Use as a calling keyword (identification word) when forcing a response on group LINE |
| responseFrequency | Set as a guideline for reaction frequency (probability) when automatically responding on group LINE |
| speechType | Specifies the Text-to-Speech (TTS) API to use<br>e.g. OpenAI / Google |
| speechModel | Model name when using OpenAI's TTS<br>e.g. tts-1 / tts-1-hd<br>https://platform.openai.com/docs/models/tts |
| speechVoice | Select audio provided by OpenAI<br>e.g. alloy / echo / fable / onyx / nova / shimmer<br>https://platform.openai.com/docs/guides/text-to-speech/voice-options |
| speechSpeed | Specify the speed of audio generated by OpenAI<br>https://platform.openai.com/docs/api-reference/audio/createSpeech |
| speechSex | Specify audio gender for Google TTS<br>e.g. MEN / FEMALE<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/SsmlVoiceGender |
| audioSpeakingRate | Specify the audio speed for Google's TTS<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| autioPitch | Specify the pitch (height) of the audio for Google's TTS<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| autioVolumeGainDb | Specify the audio volume for Google's TTS<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| systemPromptOfBotPersonality | Describe the LINE bot's personality and behavior settings. <br>Please leave the part where the output language is dynamically specified(＊) and customize the other parts.<br> `＊ You speak multiple languages, but always output your answers in ${langInEnglish}, regardless of the language in which they are asked.` |
| promptOfDetermineTheContextOfTranslation | _＊ There is no need to change...Prompt for determining internal processing conditions_<br>Determines whether a translation request has been received from the LINE bot's conversation partner. |
| promptOfDetermineTheContextOfTranslationRequestType | _＊ There is no need to change...Prompt for determining internal processing conditions_<br>Classifying the nature of messages from LINE bot conversation partners |
| promptOfDetermineTheContextOfSwitchLanguage | _＊ No need to change...Prompt for extracting internal processing conditions (information)_<br>Classifies whether the message instructs a language switch. |
| promptOfPickupLanguage | _＊ No need to change...Prompt for extracting internal processing conditions (information)_<br>Extract the "language name" of the switching language from the received message |
| promptForRequestingTranslation | _＊ No changes required… Prompt to translate in Japanese_ |
| promptForRequestingInMultilingual | _＊ No changes needed…normal conversation prompts_ |

### Packages Installation

Install the package in the local directory where you cloned the repository.

```bash
npm install
```

### Creating a new bucket in Cloudflare R2

Create R2  bucket.
 * [Create new buckets · Cloudflare R2 docs](https://developers.cloudflare.com/r2/buckets/create-buckets/)

```bash
wrangler r2 bucket create speech-audio
```

To prevent past audio data from remaining and increasing the object storage capacity, it is a good idea to set lifecycle policies such as automatically deleting data older than one week.
 * [Object lifecycles · Cloudflare R2 docs](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)

### Creating a new database and schema of Cloudflare D1

Create a database to store each user's designated language and conversation history, and define the table.
 * [Get started #3. Create a database · Cloudflare D1 docs](https://developers.cloudflare.com/d1/get-started/#3-create-a-database)

```bash
wrangler d1 create convo-db
wrangler d1 execute convo-db --file=./schema.sql
```

### Setting environment variables

Set the domain of the site that is the base of the URL as an environment variable.

```bash
npx wrangler secret put WORKERS_SITE_DOMAIN
```

Usually, the initial value is `PROJECT_NAME.YOUR_ACCOUNT_SUBDOMAIN.workers.dev` which is a combination of Cloudflare account `YOUR_ACCOUNT_SUBDOMAIN` and Cloudflare Workers project name `PROJECT_NAME`.

`YOUR_ACCOUNT_SUBDOMAIN` can be changed to any name.
 * [workers.dev · Cloudflare Workers docs](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)


Set the access token and API key for operating the API as environment variables.
 * [Commands #secret - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#secret)

```bash
npx wrangler secret put CHANNEL_ACCESS_TOKEN
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GCP_SERVICE_ACCOUNT_AUTH_KEY
```

> [!TIP]
> For Google's service account key `GCP_SERVICE_ACCOUNT_AUTH_KEY`, store the json format value as is in a variable.

## Deployment and Operation check

### Deployment

Deploy to Cloudflare Workers.
 * [Commands #deploy - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#deploy)

```bash
npm run deploy
```

To confirm operation, we will temporarily launch a live stream to check the access status to Cloudflare Workers in real time in the local environment.
 * [Commands #tail - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#tail)

```bash
wrangler tail
```

### Messaging API webhook URL settings

Register the deployed Cloudflare Workers endpoint URL `https://PROJECT_NAME.YOUR_CLOUDFLARE_WORKERS_SUBDOMAIN.workers.dev/webhook` to the webhook URL of the LINE official account.
 * [Build a bot | LINE Developers](https://developers.line.biz/en/docs/messaging-api/building-bot/#setting-webhook-url)

### Operation check

Add the established LINE official account as a friend and have a conversation.

If the logs are output to the Cloudflare Workers live stream and the response is as expected, the environment construction is complete.

## Known issues and ideas for improvements and enhancements

### Signature verification of requests to Wehbook

If you receive a request that includes the URL of a Cloudflare Workers endpoint registered in your webhook, you must verify that the request is from LINE before proceeding. 

That treatment has not yet been implemented. Validation helps prevent fraudulent requests and makes your program more secure.
 * [Verify webhook URL | LINE Developers](https://developers.line.biz/en/docs/messaging-api/verify-webhook-url/)

### Reinforcement of user profile corresponding to LINE user ID (strengthening management)

Since LINE official accounts do not have "privatization" measures or functions to restrict account users, when a request is received via a webhook, this program (AI bot) makes a judgment and takes appropriate action. .

Since the webhook request includes the LINE user ID, for example, if you want to limit the use of the AI ​​bot to family members, you can specify the family member's LINE user ID and run the AI ​​bot only for that person. That user ID. Masu.

If it is introduced with the assumption that an unspecified number of people will use it, it is possible to limit the number of times the AI ​​bot can be used or charge a fee for using the AI ​​bot based on the user ID.

### Enhanced history management

The conversation history that the AI ​​bot remembers is fixed at 15 by extraction processing (SQL statements) from Cloudflare D1, so making the number of history records a variable makes the system more flexible.

It would also be useful to have a feature that automatically deletes old conversation history.

## Notes and disclaimers

Your LINE official account cannot be completely private, so if you want to enjoy it for yourself, we recommend keeping it as private as possible to prevent it from becoming public knowledge.

In addition, to avoid unexpected expenses, set an upper limit on OpenAI API usage fees in advance or limit them within the billing amount, and automatically disable charges if the limit is exceeded. 

Please be careful not to incur unexpected charges when using the service.

The creator of this program is not responsible for any loss or trouble caused by using this program.

## Gratitude

In creating this program, I referred to the following blog entries and publicly available source code. We would like to thank the following people for sharing useful information.

[Cloudflare Worker + D1 + Hono + OpenAIでLINE Botを作る](https://zenn.dev/razokulover/articles/4d0ba10083524e)
 * [GitHub - YuheiNakasaka/line-bot-cf-worker-sample](https://github.com/YuheiNakasaka/line-bot-cf-worker-sample)

[ChatGPT APIとCloudflareを使って過去の会話を覚えてるLINEボットを構築する](https://zenn.dev/nmemoto/articles/chatgpt-linebot-with-cloudflare)
 * [GitHub - nmemoto/chatgpt-linebot-with-cloudflare](https://github.com/nmemoto/chatgpt-linebot-with-cloudflare)

[CloudFlare Workers、Cloudflare D1、HonoでLINE botを作りました](https://tkancf.com/blog/creating-line-bot-with-cloudflare-workers-d1-and-hono/)
 * [GitHub - tkancf/cf-d1-line-sample](https://github.com/tkancf/cf-d1-line-sample)

[OpenAI APIで英会話LINE Botを作る with Hono + Cloudflare Workers + Queues + D1 - $shibayu36->blog;](https://blog.shibayu36.org/entry/2023/05/25/173000)
 * [英会話LINE BotのCloudflare Queues利用部分をwaitUntil APIで書き直す - $shibayu36->blog;](https://blog.shibayu36.org/entry/2023/05/26/173000)
 * [GitHub - shibayu36/english-line-bot](https://github.com/shibayu36/english-line-bot)

## Information

The other day, an official AI service that can be used on LINE was released.
 * [友だちとトークする感覚で生成AIを利用できる「LINE」アプリ内の新サービス「LINE AIアシスタント」が登場。AIによる情報検索や画像の翻訳・解析などで日常がもっと便利に｜LINEヤフー株式会社](https://www.lycorp.co.jp/en/news/release/007735/)(In Japanese only)

The first three months are available for 500 yen, and the regular price is 990 yen. On the other hand, if you operate your own program, the monthly API usage fee will be around 500 yen to 1000 yen, depending on how you use it.

Multilingual communication is not possible with the official LINE AI Assistant, but if you simply want to use the generated AI in Japanese, or if you want to use the generated AI for a fixed fee, you may want to consider using the LINE AI Assistant. That's fine.
 * [LINE AI Assistant LP](https://lineaiassistant.landpress.line.me/about/)

## Author & Contact

Yamazaki
 * https://github.com/yamazaki
 * https://twitter.com/yamazaki

Please feel free to contact me via DM from X(Twitter).

## License

[The MIT License](./LICENSE)
