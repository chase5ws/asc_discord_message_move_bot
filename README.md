機器人權限設定：
- PRESENCE INTENT
- SERVER MEMBERS INTENT
- MESSAGE CONTENT INTENT
皆打開

邀請連結
https://discord.com/api/oauth2/authorize?client_id=your_APPLICATION_ID&permissions=8&scope=bot%20applications.commands

啟動方式是透過在終端機輸入 node index.js 但如果想要讓機器人在後台運行，可以再終端機輸入 npm install pm2 -g 下載pm2，然後輸入 pm2 start index.js --name my-discord-bot 啟用機器人，如果想要停止機器人可以輸入 pm2 stop my-discord-bot
，想要重啟可以輸入 pm2 restart my-discord-bot。

監聽頻道的權限代碼為1024
發送頻道的權限代碼為17600776236032
