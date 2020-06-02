const { parseReq } = require("../util/utility");

const pinMessage = (ctx) => {
  const text = parseReq(ctx.update.message.text);
  console.log(ctx.update.message.chat.id);

  ctx.telegram
    .sendMessage(ctx.update.message.chat.id, text, {
      parse_mode: "Markdown",
    })
    .then((res) => {
      console.log(res);
      ctx.telegram.pinChatMessage(ctx.update.message.chat.id, res.message_id, {
        disable_notification: false,
      });
    })
    .catch((err) => console.log(err));
};

module.exports = { pinMessage };
