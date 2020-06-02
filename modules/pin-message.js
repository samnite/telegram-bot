const { parseReq } = require("../util/utility");

const pinMessage = (ctx, bot) => {
  const text = parseReq(ctx.update.message.text);
  console.log(ctx.update.message.chat.id);

  bot.telegram
    .sendMessage(ctx.update.message.chat.id, text, {
      parse_mode: "Markdown",
    })
    .then((res) => {
      console.log(res);
      bot.telegram.pinChatMessage(ctx.update.message.chat.id, res.message_id, {
        disable_notification: false,
      });
    })
    .catch((err) => console.log(err));
};

module.exports = { pinMessage };
