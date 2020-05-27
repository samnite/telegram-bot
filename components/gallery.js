const fetch = require("node-fetch");
const { toJson } = require("unsplash-js");
const Unsplash = require("unsplash-js").default;
const { sendMessage } = require("../util/send-message");
const { parseReq } = require("../util/utility");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

global.fetch = fetch;
const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const gallery = (ctx, bot) => {
  const text = parseReq(ctx.update.message.text);
  let urls = [];
  if (text.length > 1) {
    const msg = `Searching for *"${text}"* photos, request can take up to 60 seconds, please wait...`;
    sendMessage(ctx, bot, msg);

    // Fetch all photos from unsplash server
    unsplash.search
      .photos(text)
      .then(toJson)
      .then((res) => {
        // Check empty response
        if (res.total_pages === 0) {
          sendMessage(ctx, bot, "Sorry, nothing found...");
          return null;
        }
        unsplash.search
          .photos(text, 1, 10)
          .then(toJson)
          .then((res) => {
            const photos = res.results;
            photos.forEach((photo) => {
              urls.push({
                type: "photo",
                media: photo.urls.regular,
                caption: `
                      *Title*: ${
                        photo.description
                          ? photo.description
                          : photo.alt_description
                      }
            *Author*: [${photo.user.name}](${photo.user.links.html})
            [Download Image](${photo.links.download})
            👍 ${photo.likes}
                      `,
                parse_mode: "Markdown",
              });
              unsplash.photos.downloadPhoto(photo);
            });
            console.log("FUUUUUURLSSSS", urls); // TODO check when 50 requests ends
            return ctx.telegram.sendMediaGroup(
              ctx.update.message.chat.id,
              urls,
              {
                reply_to_message_id: ctx.update.message.message_id,
              }
            );
          })
          .catch((err) => {
            sendMessage(
              ctx,
              bot,
              `Error: ${
                err.code === 400
                  ? "Maximum requests reached, try again later"
                  : err.description
              }`
            );
          });
      })
      .catch((err) => {
        const msg = `Error: _${err.message}_`;
        sendMessage(ctx, bot, msg);
      });
  } else {
    const msg = `please type your request to search photos in format */gallery search_request*, example: \`\`\` /gallery cool cats\`\`\``;
    sendMessage(ctx, bot, msg);
  }
};

module.exports = { gallery };
