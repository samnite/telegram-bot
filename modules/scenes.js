const Scene = require("telegraf/scenes/base");
const Stage = require("telegraf/stage");
const { enter, leave } = Stage;
const { weather } = require("./weather");

const weatherScene = new Scene("weather");
weatherScene.enter((ctx) => ctx.reply("Enter your city"));
weatherScene.leave(() => console.log("Bye"));
weatherScene.command("back", leave());
// greeterScene.hears("hi", enter("greeter"));
weatherScene.on("message", (ctx) => {
  console.log(ctx);
  // ctx.reply("Thank You");
  weather(ctx, true);
  ctx.scene.leave();
});

module.exports = { weatherScene };
