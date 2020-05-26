const fetch = require("node-fetch");
const { toJson } = require("unsplash-js");
const Unsplash = require("unsplash-js").default;

require("dotenv").config();

global.fetch = fetch;
const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const gallery = (ctx, bot) => {
  let text = ctx.update.message.text.split(" ");
  let urls = [];
  if (text.length > 1) {
    text.shift();
    bot.telegram
      .sendMessage(
        ctx.update.message.chat.id,
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, Searching "${text.join(" ")}" photos, please wait....`
      )
      .then((info) => console.log(info))
      .catch((err) => console.log(err));

    unsplash.search
      .photos(text.join(" "), 1, 8)
      .then(toJson)
      .then((json) => {
        // Your code
        const photos = json.results;
        photos.forEach((photo) => {
          urls.push({
            type: "photo",
            media: photo.urls.regular,
            caption: `
          *Title*: *${photo.alt_description}*
*Author*: [${photo.user.name}](${photo.user.links.html})
[Download Image](${photo.links.download}) 
👍 ${photo.likes}
          `,
            parse_mode: "markdown",
          });
          unsplash.photos.downloadPhoto(photo);
        });
        return ctx.telegram.sendMediaGroup(ctx.update.message.chat.id, urls, {
          reply_to_message_id: ctx.update.message.message_id,
        });
      })
      .catch((err) => console.log(err));
  } else {
    bot.telegram
      .sendMessage(
        ctx.update.message.chat.id,
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, please type your request to search photos in format */gallery search_request*, example: \`\`\` /gallery cool cats\`\`\``,
        { parse_mode: "Markdown" }
      )
      .then((info) => console.log(info))
      .catch((err) => console.log(err));
  }
};

module.exports = { gallery };
