/* eslint-disable no-mixed-spaces-and-tabs */
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token, CHANNEL_LISTEN, CHANNEL_POST } = require("./config.json");
const keep_alive = require("./keep_alive.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on(Events.MessageCreate, async (message) => {
  if (CHANNEL_LISTEN.includes(message.channel.id)) {
    const postChannel = client.channels.cache.get(CHANNEL_POST);
    // eslint-disable-next-line no-mixed-spaces-and-tabs
    // 檢查訊息是否包含圖片
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      await postChannel.send({
        content: message.content,
        files: [attachment.url],
      });
    } else {
      await postChannel.send("@everyone " + message.content);
    }
  }
});
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  if (CHANNEL_LISTEN.includes(oldMessage.channel.id)) {
    const postChannel = client.channels.cache.get(CHANNEL_POST);

    // 檢查訊息是否包含圖片
    if (newMessage.attachments.size > 0) {
      const attachment = newMessage.attachments.first();
      const fetchedMessages = await postChannel.messages.fetch({
        after: oldMessage.id,
        limit: 1,
      });
      const fetchedMessage = fetchedMessages.first();
      await fetchedMessage.edit({
        content: newMessage.content,
        files: [attachment.url],
      });
    } else {
      const fetchedMessages = await postChannel.messages.fetch({
        after: oldMessage.id,
        limit: 2,
      });
      const fetchedMessage = fetchedMessages.first();
      await fetchedMessage.edit("@everyone " + newMessage.content);
    }
  }
});
// client.on(Events.MessageDelete, async (deletedMessage) => {
//   if (CHANNEL_LISTEN.includes(deletedMessage.channel.id)) {
//     const postChannel = client.channels.cache.get(CHANNEL_POST);

//     const fetchedMessages = await postChannel.messages.fetch({
//       after: deletedMessage.id,
//       limit: 3,
//     });
//     const fetchedMessage = fetchedMessages.first();
//     if (fetchedMessage) {
//       await fetchedMessage.delete();
//       console.log(deletedMessage.id);
//       console.log("deletedMessage", fetchedMessage);
//     }
//   }
// });

client.login(token);
