# 多言語で会話するLINEボット

〜 Multilingual Convo Bot in LINE 〜

![LINE_AI_Bot_Title_Logo](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/assets/34241/00cb05d5-1d0c-44f7-ac3a-94d834a91bfa)

[README in English](README-en.md)

## 本プログラムの作成と公開について

ChatGPTをはじめとした生成系AIをLINEで自然と使えたら、IT専門ではない家族(特に子供)も気軽にAIに触れることができると考え、本プログラムの開発を始めました。

本プログラムの作成者はプログラミングを職業にしているわけではありませんので、ソースコードの品質は素人レベルと捉えてください。

謝辞に掲載しています他者のブログエントリーや公開ソースを参考に実装を進め、そこに作成者自身のアイデアを盛り込んで拡張カスタマイズしたプログラムになっています。

ソースコードを公開することで本プログラムの作成者と同じようにLINEを活用して生成AIに親しみたいと考えている方や、利用している要素技術に興味のある方の実装の参考になれば幸いです。

## 概要

本プログラムは、LINE上で動作する多言語での会話コミュニケーションを実現するOpenAI(ChatGPT)のAPIを利用したAIボットです。

多言語と銘打っている通り、英語だけではなく、2024年2月現在でChatGPT/OpenAIのAPIがサポートしている60弱の言語での会話が楽しめます。

一般的なAIボットは、日本語の投稿に対しては日本語で応答、英語なら英語で応答しますが、本AIボットは、利用者が投稿したメッセージの言語に関係なく、予め指定した言語で応答してくれるほか、会話の途中で言語の切り替えを伝えることもできます。

つまり、利用者が日本語で話しかけ続けたとしても、AIボットは英語やフランス語で継続して応答してくるということです。

＊ 下記、画像は、サンプルプロンプトで指定しているイタリア語の動作例
<p align="center">
<img src="https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/assets/34241/a6a7299f-be4a-40a7-8d03-bbd88d1934d7" width="500">
</p>

また、LINE上でのやり取りは指定の言語での会話に補足して、その会話の音声とカタコトの日本語訳も添えて応答します。

音声の聴き取りによるリスニングの強化や、音声の発音を真似るスピーキングの練習(シャドーイング)にも活かすもできるほか、指定言語が学習途中で不慣れな場合でも、併記されている日本語訳を見ながらスムーズな会話が実現できます。

1対1の会話のほか、LINEのグループに参加させることもできるため、例えば、家族のグループLINEにAIボットを招待させることで、家族間の会話にAIボットが時折「合いの手」を挟んでくるといった楽しみ方もできます。

LINEのグループにAIボットを参加させた場合、AIボットの自動応答を10回に1回の確率(割合)で実行させるといった応答頻度の調整が可能です。

AIボットは会話の履歴を一定期間保持しているため、連続的な会話を踏まえて応答します。

## 利用技術

- Cloudflare Workers
- Cloudflare R2
- Cloudflare D1
- Hono
- TypeScript
- OpenAI API
- Google Cloud Text-to-Speech API

Messaging APIを利用したLINE公式アカウント(ボット)をCloudflare Workers上で動作させ、会話に必要なテキストメッセージの生成は、ChatGPTと同等機能のOpenAIのAPIを利用しています。

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fworkers%2F)](https://developers.cloudflare.com/workers/)

フレームワークはCloudflare Workers上で動作する日本発信のHonoを採用しています。

[![Hono](https://img.shields.io/github/stars/honojs/hono?style=for-the-badge&logo=hono&label=Hono&link=https%3A%2F%2Fgithub.com%2Fhonojs%2Fhono)](https://github.com/honojs/hono)
[![TypeScript](https://img.shields.io/badge/TypeScript-2762ba?style=for-the-badge&logo=typescript&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://www.typescriptlang.org/)

音声データの生成は、OpenAIのText-to-speech(TTS)のほかに、Google CloudのTTSに切り替えもできます。GoogleのTTSは、男女の性別指定や、声の高さ(ピッチ)の変更なども可能なため、好みに応じた細かな調整が可能です。

[![OpenAI API](https://img.shields.io/badge/OpenAI_API-229972?style=for-the-badge&logo=openai&link=https%3A%2F%2Fplatform.openai.com%2Fdocs%2Fapi-reference)](https://platform.openai.com/docs/api-reference)
[![Google Cloud Text-to-Speech API](https://img.shields.io/badge/Google_Cloud_API_TTS-4d5055?style=for-the-badge&logo=google&link=https%3A%2F%2Fcloud.google.com%2Ftext-to-speech)](https://cloud.google.com/text-to-speech)

音声データの保管には、オブジェクトストレージのCloudflare R2、会話履歴の保存には、Cloudflare D1を利用しています。

[![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fr2%2F)](https://developers.cloudflare.com/r2/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-F89D33?style=for-the-badge&logo=cloudflare&link=https%3A%2F%2Fdevelopers.cloudflare.com%2Fd1%2F)](https://developers.cloudflare.com/d1/)

## 事前準備

セットアップをスムーズに進めるために、以下の事前準備が必要です。

- Cloudflareのアカウント作成
- OpenAIのアカウント作成とAPIシークレットキーの取得
- LINEアカウントの作成とLINE Developersコンソールへのログイン
- Messaging APIのLINE公式アカウントの作成とチャンネルアクセストークンの取得

必要に応じて、Google CloudのText-to-Speech(TTS)を利用したい場合は、以下の準備も必要です。

- Googleアカウントの作成
- Google Cloudコンソールへのログイン
- Google Cloud Text-to-Speech APIのサービスアカウントキーの取得

事前準備の詳細については本ページでの解説は省略します。検索するとネットの情報がたくさん見つかりますので、それらを参考に準備を進めてください。
以降、準備にあたり必要なアクセス先のリンクを記します。

### Cloudflare関連

Cloudflareのアカウントを作成します。
 * [Create an account · Getting started · Learning paths](https://developers.cloudflare.com/learning-paths/get-started/account-setup/create-account/)

### OpenAI関連

ChatGPTのアカウントがあれば、そちらを利用できます。もし、まだOpenAIのアカウントがない場合は、以下の「Sing up」よりアカウントの作成ができます。
 * [OpenAI API](https://openai.com/blog/openai-api)

APIシークレットキーの取得は以下より行います。
 * [API keys - OpenAI API](https://platform.openai.com/api-keys )

キーの取り扱いについては、以下も参考にしてください。
 * [Best Practices for API Key Safety | OpenAI Help Center](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)

### LINE関連

個人のLINEアカウントを利用して、LINE Developerコンソールへログインができます。初回ログイン時に「プロバイダー」を作成します。
 * [LINE Developersコンソールへのログイン | LINE Developers](https://developers.line.biz/ja/docs/line-developers-console/login-account/)

Messaging APIを利用するLINE公式アカウントの作成は、「プロバイダー」内に「チャンネル」を設置することと同義です。
 * [Messaging APIを始めよう | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/getting-started/)

チャンネル作成の際にアカウントのアイコンになる画像やプロフィールの背景画像を用意しておくと、LINEアプリ上で公式アカウントにアクセスした際に見栄えが良くなります。

アイコンや背景画像の作成にも、せっかくなので以下ような画像生成のAIサービスを利用すると良いでしょう。

- [OpenAI DALL·E 2](https://openai.com/dall-e-2)
- [DreamStudio by stability.ai](https://beta.dreamstudio.ai/generate)
- [Canva Magic Media](https://www.canva.com/)

DALLは毎月の作成数の制限があり、DreamStudioとCanvaはアカウント作成時に無料利用分のクレジットが発行され、そのクレジット内での作成であれば無料で画像を生成できます。

Messaging APIを利用するために、チャンネルアクセストークンを発行します。
 * [チャネルアクセストークンv2.1を発行する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/generate-json-web-token/)

グループトークにLINE公式アカウントを招待／参加させるには追加設定が必要です
 * [グループトークや複数人トークにLINE公式アカウントを招待する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/group-chats/#add-bot-group-room)

### Google Cloud関連

Googleアカウントを利用して、Google Cloudコンソールにログインします。
 * [Google Cloud コンソール  |  Cloud Console - ウェブ UI の管理](https://cloud.google.com/cloud-console?hl=ja)

Text-to-SpeechのAPIの有効化します。
 * [始める前に  |  Cloud Text-to-Speech API  |  Google Cloud](https://cloud.google.com/text-to-speech/docs/before-you-begin)

サービスアカウントキーをJSON形式で取得します。
 * [サービス アカウント キーの作成と管理  |  IAM のドキュメント  |  Google Cloud](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

## 設置方法

大まかな流れは以下のようになります。

1. リポジトリからソースコードをローカル環境にクローン
2. リポジトリに含まれない動作に必要なファイルの追加と編集
3. LINEボットの挙動を決める定数や変数の設定とプロンプトの編集
4. ローカル環境でのパッケージインストール
5. Cloudflare R2の新規バケット作成
6. Cloudflare D1の新規データベースとスキーマ作成
7. 環境変数のセット
8. デプロイと動作確認
9. LINE公式アカウントのMessaging APIのWebhook URL設定

### リポジトリのクローン

ご自身のソースコードの編集履歴を管理できるように、本リポジトリをフォークしていただくと良いと思います。
 * [リポジトリをフォークする - GitHub Docs](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

ローカル環境の適当なディレクトリに移動して、フォークしたリポジトリからクローンを実行します。

```bash
cd ~/Development/LINE-Bot
git clone https://github.com/YOUR_ACCOUNT/Multilingual-Convo-Bot-in-LINE.git ./
```

### ファイルの追加 wrangler.toml

リポジトリ直下に`wrangler.toml`ファイルを追加します。

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

- name … Cloudflare Workersのプロジェクト名でエンドポイント(URL)のサブドメインに使われます。
- node_compat … 音声ファイルの長さを解析するライブラリ `music-metadata` を利用するために必要なフラグを有効化します。
    - [Configuration ​​#Add polyfills using Wrangler - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/configuration/#add-polyfills-using-wrangler)
- database_id … 後述のDBを作成するコマンドを実行して、標準出力に表示されたIDを転記します。

### 定数や変数の設定とプロンプトの編集 src/prompt.ts

サンプルとしてリポジトリに含めている`src/prompt.ts.sample`のファイル名を`src/prompt.ts`にリネームします。

定義している項目の内、全大文字のスネークケース(e.g. `SIMULTANEOUS_TRANSLATION`)の定数は、各利用者ごとの環境に変わっても変更する必要がない固定化された項目になります。

`prompt*`のプロンプトの変数は、通常は変更する必要はありませんが、出力精度を上げるためのチューニングの改変は可能です。ただし、基本的な挙動、出力結果に影響がないように編集してください。

そして、上記以外の定数や変数については、環境や好みに応じて自由に変更してください。

各定義項目の説明表です。

| 定義項目 | 設定内容 |
| --- | --- |
| fixedLang | 設定言語を固定化するかどうかの設定(true : 固定化 ／ false : 非固定) |
| defaultTalkLang | デフォルトの言語を日本語で1つ指定<br>e.g. 英語 / フランス語 / スペイン語  |
| botNames | LINEボットのキャラクター名を日本語表記、英語表記、あるいは、ニックネームを複数(配列)で指定<br>グループLINEで強制的に応答させる時の呼びかけキーワード(識別単語)として利用 |
| constantTranslation | 常時、同時通訳を出力するかどうかの設定(true : 常時同時通訳 ／ false : 指定に従う) |
| responseFrequency | グループLINEで自動応答する際の反応頻度(確率)の目安として設定<br>グループへ投稿されたメッセージのn回に1回の確率で反応とした場合のnを指定 |
| gptModel | OpenAI APIのモデルを指定<br>e.g. gpt-4o / gpt-4-turbo<br>https://platform.openai.com/docs/models |
| speechType | 音声データを「OpenAI」「Google」どちらのText-to-Speech(TTS)で生成するかを指定<br>e.g. OpenAI / Google |
| speechModel | OpenAIのTTSを利用する場合のモデル名<br>e.g. tts-1 / tts-1-hd<br>https://platform.openai.com/docs/models/tts |
| speechVoice | OpenAIが提供している音声を選択<br>e.g. alloy / echo / fable / onyx / nova / shimmer<br>https://platform.openai.com/docs/guides/text-to-speech/voice-options |
| speechSpeed | OpenAIで生成する音声のスピードを指定<br>https://platform.openai.com/docs/api-reference/audio/createSpeech |
| speechSex | GoogleのTTSの場合の音声の性別を指定<br>e.g. MALE / FEMALE<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/SsmlVoiceGender |
| audioSpeakingRate | GoogleのTTSの場合の音声のスピードを指定<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| autioPitch | GoogleのTTSの場合の音声のピッチ(高さ)を指定<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| autioVolumeGainDb | GoogleのTTSの場合の音声の音量を指定<br>https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig |
| systemPromptOfBotPersonality | LINEボットのキャラクター設定を記述<br>サンプルの記述を参考に、出力言語を動的に指定できるようにしているため、その辺りの記述(＊)は残して、キャラクター設定部分をカスタマイズしてください<br> `＊ You speak multiple languages, but always output your answers in ${langInEnglish}, regardless of the language in which they are asked.` |
| promptOfDetermineTheContextOfTranslation | _＊ 変更不要 … 内部処理の条件判断をするためのプロンプト_<br>LINEボットの対話相手から翻訳の依頼が来ているかどうかを判断 |
| promptOfDetermineTheContextOfTranslationRequestType | ＊ _変更不要 … 内部処理の条件判断をするためのプロンプト_<br>LINEボットの対話相手からのメッセージの性質を分類 |
| promptOfDetermineTheContextOfSwitchLanguage | ＊ _変更不要 … 内部処理の条件(情報)を抽出するためのプロンプト_<br>LINEボットの対話相手からのメッセージが言語切り替えかどうかを分類 |
| promptOfPickupLanguage | ＊ _変更不要 … 内部処理の条件(情報)を抽出するためのプロンプト_<br>LINEボットの対話相手からのメッセージから切り替え言語の「言語名」を抽出 |
| promptForRequestingTranslation | ＊ _変更不要 … 日本語訳を取得するためのプロンプト_ |
| promptForRequestingInMultilingual | ＊ _変更不要 … 通常の応答メッセージのプロンプト_ |

### パッケージインストール

リポジトリをクローンしたローカルのディレクトリでパッケージをインストールします。

```bash
npm install
```

### Cloudflare R2の新規バケット作成

オブジェクトストレージのR2を作成します。
 * [Create new buckets · Cloudflare R2 docs](https://developers.cloudflare.com/r2/buckets/create-buckets/)

```bash
wrangler r2 bucket create speech-audio
```

過去の音声データが残り続け、オブジェクトストレージの容量が肥大化しないよう、1週間より前のデータは自動削除するなどのライフサイクルのポリシー設定をしておく良いです。
 * [Object lifecycles · Cloudflare R2 docs](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)

### Cloudflare D1の新規データベースとスキーマ作成

利用者ごとの指定言語や会話の履歴を保存するためのデータベースを作成し、テーブル定義を実行します。
 * [Get started #3. Create a database · Cloudflare D1 docs](https://developers.cloudflare.com/d1/get-started/#3-create-a-database)

```bash
wrangler d1 create convo-db
wrangler d1 execute convo-db --file=./schema.sql
```

### 環境変数のセット

URLのベースになるサイトのドメインを環境変数として設定します。

```bash
npx wrangler secret put WORKERS_SITE_DOMAIN
```

通常、初期値して、Cloudflareのアカウント `YOUR_ACCOUNT_SUBDOMAIN` と、Cloudflare Workersのプロジェクト名 `PROJECT_NAME` の組み合わせで `PROJECT_NAME.YOUR_ACCOUNT_SUBDOMAIN.workers.dev` となります。

`YOUR_ACCOUNT_SUBDOMAIN` は任意の名称に変更が可能です。
 * [workers.dev · Cloudflare Workers docs](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)


APIを操作するためのアクセストークンやAPIキーを環境変数として設定します。
 * [Commands #secret - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#secret)

```bash
npx wrangler secret put CHANNEL_ACCESS_TOKEN
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GCP_SERVICE_ACCOUNT_AUTH_KEY
```

> [!TIP]
> Googleのサービスアカウントキー `GCP_SERVICE_ACCOUNT_AUTH_KEY` は、json形式の値そのままを変数に格納しておきます。

## デプロイと動作確認

### デプロイ

Cloudflare Workersにデプロイします。
 * [Commands #deploy - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#deploy)

```bash
npm run deploy
```

動作確認のため、一時的にローカル環境にてCloudflare Workersへのアクセス状況をリアルタイムで確認するライブストリームを起動します。
 * [Commands #tail - Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/commands/#tail)

```bash
wrangler tail
```

### Messaging APIのWebhook URL設定

LINE公式アカウントのWebhook URLにデプロイしたCloudflare WorkersのエンドポイントURL `https://PROJECT_NAME.YOUR_CLOUDFLARE_WORKERS_SUBDOMAIN.workers.dev/webhook` を登録します。
 * [ボットを作成する #Webhook URLを設定する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/building-bot/#setting-webhook-url)

### 動作確認

設置したLINE公式アカウントを友だち追加して、会話を実施します。

Cloudflare Workersのライブストリームにログが出力され、想定通りの応答があれば、環境構築完了です。

## 既知の課題と改修、機能拡張のアイデア

### Wehbookへのリクエストの署名検証

Webhookに登録したCloudflare Workers側のエンドポイントのURLでリクエストを受け取った際に、LINEからのリクエストであることを検証した上で後続の処理を進める必要があります。その処置については未実装です。検証により、不正なリクエストを弾くことができ、よりセキュアなプログラムとなります。
 * [Webhook URLを検証する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/verify-webhook-url/)

### LINEのユーザーIDに対応する利用者プロファイルの補強(管理強化)

LINE公式アカウントは、そのアカウントの利用者を限定するような「プライベート化」の処置／機能は提供していないため、Webhookによるリクエストを受けた際に、本プログラム(AIボット)側で判断、対処する必要があります。

WebhookのリクエストにはLINEのユーザーIDが含まれるため、例えば、AIボットの利用を家族に限定したい場合に、家族のLINEのユーザーIDを特定して、そのユーザーIDの場合にのみAIボットを動作させるような制御も可能です。

不特定多数に利用される前提で設置した場合に、利用者を識別することで、AIボットの利用回数を制限したり、有料化して課金情報を保持するといったことも可能になります。

### 履歴管理の強化

AIボットが記憶する会話履歴はCloudflare D1からの抽出処理(SQL文)で15件固定としているため、履歴件数を変数化するとより柔軟な仕組みになります。

また、古い会話履歴を自動で削除する機能もあると便利です。

## 注意事項及び免責事項

LINE公式アカウントは完全プライベート化ができませんので、個人で楽しむ場合はできるだけ公に知られることがないように、極力、非公開な取り扱いで環境整備をすることをお勧めします。

また、想定外の費用出費が発生しないように、OpenAIのAPIの使用料については予め上限を設定しておくこと、あるいは、課金(チャージ)した金額の範囲内のみとし、超過発生時に自動チャージ(課金)されないようにしておくなど、十分に考慮／注意の上、ご利用ください。

なお、本プログラムを使用したことにより生じた損失やトラブルについて、本プログラムの作成者は一切の責任を負わないものとします。

## 謝辞

本プログラムの作成にあたり、以下のブログエントリーや公開されているソースコードを参考にしました。有益な情報を公開してくださった下記の皆様に感謝いたします。

[Cloudflare Worker + D1 + Hono + OpenAIでLINE Botを作る](https://zenn.dev/razokulover/articles/4d0ba10083524e)
 * [GitHub - YuheiNakasaka/line-bot-cf-worker-sample](https://github.com/YuheiNakasaka/line-bot-cf-worker-sample)

[ChatGPT APIとCloudflareを使って過去の会話を覚えてるLINEボットを構築する](https://zenn.dev/nmemoto/articles/chatgpt-linebot-with-cloudflare)
 * [GitHub - nmemoto/chatgpt-linebot-with-cloudflare](https://github.com/nmemoto/chatgpt-linebot-with-cloudflare)

[CloudFlare Workers、Cloudflare D1、HonoでLINE botを作りました](https://tkancf.com/blog/creating-line-bot-with-cloudflare-workers-d1-and-hono/)
 * [GitHub - tkancf/cf-d1-line-sample](https://github.com/tkancf/cf-d1-line-sample)

[OpenAI APIで英会話LINE Botを作る with Hono + Cloudflare Workers + Queues + D1 - $shibayu36->blog;](https://blog.shibayu36.org/entry/2023/05/25/173000)
 * [英会話LINE BotのCloudflare Queues利用部分をwaitUntil APIで書き直す - $shibayu36->blog;](https://blog.shibayu36.org/entry/2023/05/26/173000)
 * [GitHub - shibayu36/english-line-bot](https://github.com/shibayu36/english-line-bot)

## おまけ

先日、LINE上で利用できる公式のAIサービスがリリースされました。
 * [友だちとトークする感覚で生成AIを利用できる「LINE」アプリ内の新サービス「LINE AIアシスタント」が登場。AIによる情報検索や画像の翻訳・解析などで日常がもっと便利に｜LINEヤフー株式会社](https://www.lycorp.co.jp/ja/news/release/007735/)

最初の3か月は500円、正規の定価は990円で利用できるようです。本プログラムのように自前で運営する場合、使い方にもよりますが、本プログラム作成者の実績値としては、月のAPI使用料は500〜1000円程度で済んでいます。

LINE公式のAIアシスタントでは多言語でのコミュニケーションはできませんが、シンプルに生成AIを日本語で使いたい場合や、金額固定で生成AIを使いたい場合は、LINE AIアシスタントの利用を検討しても良いかもしれません。
 * [LINE AI Assistant LP](https://lineaiassistant.landpress.line.me/about/)

## 作成者 & コンタクト

Yamazaki
 * https://github.com/yamazaki
 * https://twitter.com/yamazaki

気軽に、XからDMなど、連絡ください。

## ライセンス

[MITライセンス](./LICENSE)

## 変更履歴

 * 2024-11-03 ... [00fcb35](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/commit/00fcb35593beca412d0b29eb7237641e26b2b3be)
   * 新しいオプション設定(言語固定と常時通訳)を追加
 * 2024-05-23 ... [8cff053](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/commit/8cff053c8496c012413b5947f3a9c3e6bcd769c0)
   * GPT-4oに対応、併せて、モデルをハードコーディングからprompt.tsの定数で指定できる形に変更
 * 2024-03-17 ... [95b8667](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/commit/95b86674baaa7a035435aa2d371aa5316df63410)
   * 音声にGoogle Text-to-speechを利用した場合の、READMEの説明書きとプロンプトのコメントアウトの指定方法が間違っていたので、そちらを修正
 * 2024-03-03 ... [4132794](https://github.com/yamazaki/Multilingual-Convo-Bot-in-LINE/commit/4132794e3781c1df1f7f7334775158bad0251cb2)
   * コード中の変数として定義していたCloudflare Workersのサイトのドメイン名を、環境変数に設定する方式に変更
