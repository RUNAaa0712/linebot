const https = require("https")
const express = require("express")
const Twitter = require('twitter')

const app = express()
const export_func = require("./export.js")

const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN
const linenotifytoken = process.env.LINENotifyTOKEN
// const TWITTER_CONSUMER_KEY = 'vbCWsaUENeh8WugyHaurczTRp';
// const TWITTER_CONSUMER_SECRET = 'IoIV88SW4hCPzHnGVvfiKjlMcwDDxBEH0sB32H9gZJpFhQWrwj';
// const TWITTER_ACCESS_TOKEN = '1396302235315838976-vr7NtexaQ9vWufsSgStukc5W8EJr0V';
// const TWITTER_ACCESS_TOKEN_SECRET = 'PwiWOynyrS4lCORW1mJ4iC6H51ytA2oeqSZiMcdAvUdWY';

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
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
    var nowTime = new Date();
    let nowHour = nowTime.getHours().toString();
    let nowMin  = nowTime.getMinutes().toString();
    if(nowMin.length==1) nowMin = '0'+nowMin;
    let nowSec  = nowTime.getSeconds().toString();
    if(nowSec.length==1) nowSec = '0'+nowSec;
    let time = nowHour + ":" + nowMin + ":" + nowSec;
    
    message_text = req.body.events[0].message.text
    msg_list = message_text.split(/[,、]/)
    tweet( message_text, msg_list, time )
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

function tweet( message_text, msg_list, time ) {
  let postContent = "";
  postflg = false
  //空白じゃない場合の処理
  if( message_text == "" ) {
    console.log( "空白の時の処理" )
  }

  // 空白ではなく配列が1の場合の処理
  else if( msg_list.length == 1 ) {
    postContent = msg_list.toString()
    postContent += "\n" + time
    postflg = true
    console.log( "配列1の時の処理", postContent )
  }

  // 配列が2以上の時の処理
  else if( msg_list.length >= 2 ) {
    for( let n = 0; n < msg_list.length; n++ ) {
      postContent += msg_list[n] + "\n"
    }
    postContent += "\n" + time
    postflg = true
    console.log( "配列2の時の処理", postContent )
  }
  
  const params = { status: postContent };
  if( postflg ) twitter.post('statuses/update', params,  (error, tweet, response) => {

    if(error) {

      // もしエラーが発生したらここでメールなどで通知するといいでしょう。

    } else {

      // 成功した場合

    }

  });
}