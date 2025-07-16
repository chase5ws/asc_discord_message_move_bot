// 引入 Node.js 內建的 http 模組
var http = require('http')

// 使用 http.createServer 建立一個 HTTP 伺服器
// 傳入的 function 會在每次有用戶端請求時執行
http.createServer(function (req, res) {
  // 回應用戶端一段文字
  res.write("I'm alive");
  // 結束回應，告訴瀏覽器資料已傳送完畢
  res.end();
  // 如果沒有 res.end()，瀏覽器會一直等待資料
})
// 讓伺服器開始監聽 8080 這個 port
.listen(8080);

// 啟動後你可以用瀏覽器或 curl 連到 http://localhost:8080
// 就會看到回應 "I'm alive"
