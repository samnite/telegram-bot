const sendMessage = (ctx, msg, markdown = true, isPersonal = true) => {
	const message = isPersonal
		? `@${
				ctx.update.message.from.username
					? ctx.update.message.from.username
					: ctx.update.message.from.first_name
		  }, ${msg}`
		: msg;
	ctx.telegram
		.sendMessage(ctx.update.message.chat.id, msg, { parse_mode: markdown ? "HTML" : null })
		.then((info) => console.log(info))
		.catch((err) => console.log(err));
};

module.exports = { sendMessage };
