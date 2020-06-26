const Scene = require("telegraf/scenes/base");
const Stage = require("telegraf/stage");
const { enter, leave } = Stage;
const { weather } = require("./weather");
const { translator } = require("./translator");
const { gallery } = require("./gallery");

const weatherScene = new Scene("weather");
weatherScene.enter((ctx) => ctx.reply("Enter your city"));
weatherScene.on("message", (ctx) => {
  weather(ctx, true);
  ctx.scene.leave();
});

const translatorScene = new Scene("translator");
translatorScene.enter((ctx) => ctx.reply("Enter text to translate"));
translatorScene.on("message", (ctx) => {
  translator(ctx, true);
  ctx.scene.leave();
});

const galleryScene = new Scene("gallery");
galleryScene.enter((ctx) =>
  ctx.reply("Enter your request to search photos (ex. Cats)")
);
galleryScene.on("message", (ctx) => {
  gallery(ctx, true);
  ctx.scene.leave();
});

module.exports = { weatherScene, translatorScene, galleryScene };
