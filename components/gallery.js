const fetch = require("node-fetch");
const { toJson } = require("unsplash-js");
const Unsplash = require("unsplash-js").default;

global.fetch = fetch;
const unsplash = new Unsplash({
  accessKey: "quKHIfFVPFji9Myqkvp9l4fdNh_qYFEmZo4CKGhwpd0",
});

const gallery = (ctx) => {
  let urls = [];
  unsplash.search
    .photos("javascript", 1, 5)
    .then(toJson)
    .then((json) => {
      // Your code
      const photos = json.results;
      photos.forEach((photo) => {
        urls.push({ type: "photo", media: photo.urls.small });
      });
      console.log(ctx.update.message.message_id);
      return ctx.telegram.sendMediaGroup(ctx.update.message.chat.id, urls, {
        reply_to_message_id: ctx.update.message.message_id,
      });
      // return ctx.replyWithMediaGroup({
      //   chat_id: ctx.update.message.chat.id,
      //   media: urls,
      //   // reply_to_message_id: ctx.update.message.message_id,
      // });
    });

  // unsplash.photos
  //   .listPhotos(1, 2, "latest")
  //   .then(toJson)
  //   .then((json) => {
  //     // Your code
  //     console.log(json);
  //     return ctx.replyWithPhoto(json[0].urls.regular);
  //   });
};

module.exports = { gallery };
