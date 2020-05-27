const sendMessage = (ctx, bot, msg) => {
  bot.telegram
    .sendMessage(
      ctx.update.message.chat.id,
      `@${
        ctx.update.message.from.username
          ? ctx.update.message.from.username
          : ctx.update.message.from.first_name
      }, ${msg}`,
      { parse_mode: "Markdown" }
    )
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = { sendMessage };
