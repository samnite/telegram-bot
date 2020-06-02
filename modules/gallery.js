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

const gallery = (ctx) => {
  const text = parseReq(ctx.update.message.text);
  let urls = [];
  if (text.length > 1) {
    const msg = `Searching for *"${text}"* photos, request can take up to 60 seconds, please wait...`;
    sendMessage(ctx, msg);

    // Fetch all photos from unsplash server
    unsplash.photos
      .getRandomPhoto({
        query: encodeURI(text),
        count: 8,
      })
      .then(toJson)
      .then((res) => {
        // Check empty response
        if (res.errors) {
          sendMessage(ctx, `Error: *${res.errors}*`);
          return null;
        }
        res.forEach((photo) => {
          urls.push({
            type: "photo",
            media: photo.urls.regular,
            caption: `
                      Title: ${
                        photo.description
                          ? photo.description
                          : photo.alt_description
                      }
            Author: ${photo.user.name} (${photo.user.links.html})
            Download Image: (${photo.links.download})
            👍 ${photo.likes}
                      `,
          });
          unsplash.photos.downloadPhoto(photo);
        });
        return ctx.replyWithMediaGroup(urls, {
          reply_to_message_id: ctx.update.message.message_id,
        });
      })
      .catch((err) => {
        const msg = `Error: Something went wrong, try again later`;
        sendMessage(ctx, msg);
      });
  } else {
    const msg = `please type your request to search photos in format */gallery search_request*, example: \`\`\` /gallery cool cats\`\`\``;
    sendMessage(ctx, msg);
  }
};

module.exports = { gallery };
