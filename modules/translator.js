const axios = require("axios");
const { sendMessage } = require("../util/send-message");
const { parseReq } = require("../util/utility");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const translator = (ctx, isButton = false) => {
	const text = isButton ? ctx.update.message.text : parseReq(ctx.update.message.text);
	if (text.length > 1) {
		axios
			.post(
				`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_KEY}`,
				{
					q: text,
					target: "ru",
				}
			)
			.then((res) => {
				const data = res.data.data.translations; // Array
				console.log(res.data.data);
				if (data[0].detectedSourceLanguage === "en") {
					sendMessage(ctx, data[0].translatedText, false);
				} else {
					axios
						.post(
							`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_KEY}`,
							{ q: text, target: "en" }
						)
						.then((res) => {
							const data = res.data.data.translations; // Array
							console.log(res.data.data);
							sendMessage(ctx, data[0].translatedText, false);
						});
				}
			});
	} else {
		sendMessage(
			ctx,
			`please type your request to translating in format <b>/translate search_request</b>, example: <code> /translate translate me</code>`
		);
	}
};

module.exports = { translator };
