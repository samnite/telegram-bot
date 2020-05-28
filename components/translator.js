const axios = require("axios");
const { sendMessage } = require("../util/send-message");
const { parseReq } = require("../util/utility");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const translator = (ctx, bot) => {
  const text = parseReq(ctx.update.message.text);
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
          sendMessage(ctx, bot, data[0].translatedText, false);
        } else {
          axios
            .post(
              `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_KEY}`,
              { q: text, target: "en" }
            )
            .then((res) => {
              const data = res.data.data.translations; // Array
              console.log(res.data.data);
              sendMessage(ctx, bot, data[0].translatedText, false);
            });
        }
      });
  } else {
    sendMessage(
      ctx,
      bot,
      `please type your request to translating in format */translate search_request*, example: \`\`\` /translate translate me\`\`\``
    );
  }
};

module.exports = { translator };
