/* eslint-disable no-mixed-spaces-and-tabs */

// 引入discord.js函式庫
const { Client, Events, GatewayIntentBits } = require("discord.js");
// 從config.json取得設定的token、CHANNEL_LISTEN和CHANNEL_POST
const { token, CHANNEL_LISTEN, CHANNEL_POST } = require("./config.json");
// 引入保持伺服器運行的keep_alive模組
const keep_alive = require("./keep_alive.js");

// 創建一個新的Discord客戶端
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,            // 伺服器的相關資訊
    GatewayIntentBits.GuildMessages,     // 接收伺服器的訊息
    GatewayIntentBits.MessageContent,    // 接收訊息內容
    GatewayIntentBits.GuildMembers,      // 接收伺服器成員相關事件
  ],
});

// 當客戶端成功登入後，會觸發此事件
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 當有新訊息創建時，會觸發此事件
client.on(Events.MessageCreate, async (message) => {
  // 檢查訊息是否來自指定的監聽頻道
  if (CHANNEL_LISTEN.includes(message.channel.id)) {
    const postChannel = client.channels.cache.get(CHANNEL_POST); // 取得要發送訊息的目標頻道

    // 檢查訊息是否包含附件（圖片等）
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first(); // 取得第一個附件
      await postChannel.send({
        content: message.content, // 發送訊息的內容
        files: [attachment.url],   // 發送附件的URL
      });
    } else {
      // 如果訊息沒有附件，則直接發送消息並標註特定角色
      await postChannel.send("<@&1131967125335048293>" + message.content);
    }
  }
});

// 當有已更新的訊息時，會觸發此事件
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  // 檢查更新的訊息是否來自指定的監聽頻道
  if (CHANNEL_LISTEN.includes(oldMessage.channel.id)) {
    const postChannel = client.channels.cache.get(CHANNEL_POST); // 取得目標頻道

    // 檢查更新後的訊息是否包含附件（圖片等）
    if (newMessage.attachments.size > 0) {
      const attachment = newMessage.attachments.first(); // 取得第一個附件
      const fetchedMessages = await postChannel.messages.fetch({
        after: oldMessage.id,  // 根據舊訊息ID來搜尋
        limit: 1,              // 限制搜尋條數
      });
      const fetchedMessage = fetchedMessages.first();
      await fetchedMessage.edit({
        content: newMessage.content, // 編輯訊息內容
        files: [attachment.url],     // 編輯訊息的附件
      });
    } else {
      const fetchedMessages = await postChannel.messages.fetch({
        after: oldMessage.id,  // 根據舊訊息ID來搜尋
        limit: 2,              // 限制搜尋條數
      });
      const fetchedMessage = fetchedMessages.first();
      await fetchedMessage.edit("<@&1131967125335048293>" + newMessage.content); // 編輯訊息內容並標註特定角色
    }
  }
});

// 登入Discord伺服器
client.login(token);
