const https = require("https")
const express = require("express")
const Twitter = require('twitter')

const app = express()
const export_func = require("./export.js")

const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

const TWITTER_CONSUMER_KEY = 'vbCWsaUENeh8WugyHaurczTRp';
const TWITTER_CONSUMER_SECRET = 'IoIV88SW4hCPzHnGVvfiKjlMcwDDxBEH0sB32H9gZJpFhQWrwj';
const TWITTER_ACCESS_TOKEN = '1396302235315838976-vr7NtexaQ9vWufsSgStukc5W8EJr0V';
const TWITTER_ACCESS_TOKEN_SECRET = 'PwiWOynyrS4lCORW1mJ4iC6H51ytA2oeqSZiMcdAvUdWY';

const twitter = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
  // res.send(export_func.deal_with("aaaa"))
})

app.post("/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // ユーザーがボットにメッセージを送った場合、返信メッセージを送る

  /*
  if (req.body.events[0].type === "message") {
    message_text = req.body.events[0].message.text
    // 文字列化したメッセージデータ
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          "type": "text",
          "text": export_func.deal_with(message_text)
        }
      ]
    })
    
    // リクエストヘッダー
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }
    
    // リクエストに渡すオプション
    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }
    
    // リクエストの定義
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d)
      })
    })
    
    // エラーをハンドル
    request.on("error", (err) => {
      console.error(err)
    })
    
    // データを送信
    request.write(dataString)
    request.end()
  }
  */

  //tweetする
  if (req.body.events[0].type === "message") {
    message_text = req.body.events[0].message.text
    tweet(message_text)
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

function tweet( text ) {
  const postContent = text;
  const params = { status: postContent };
  twitter.post('statuses/update', params,  (error, tweet, response) => {

    if(error) {

      // もしエラーが発生したらここでメールなどで通知するといいでしょう。

    } else {

      // 成功した場合

    }

  });
}