const { sendMessage } = require("./util/send-message");
const { weather } = require("./modules/weather");
const { Telegraf } = require("telegraf");
const { fetchData } = require("./modules/covid");
const { pinMessage } = require("./modules/pin-message");
const { counterStrikeInfo } = require("./modules/counterStrike");
const { badWordsFilter } = require("./modules/badWordsFilter");
const { gallery } = require("./modules/gallery");
const { translator } = require("./modules/translator");
const { updateCovidData } = require("./util/updateCovidBase");
const { isAdmin } = require("./util/utility");
// test stuff
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const { enter, leave } = Stage;
// test stuff
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

// Cron task
const job = new CronJob("0 0 */6 * * *", function () {
  // Update Covid-19 Database
  updateCovidData(bot);
});
job.start();

// Keyboard element start
// Greeter scene
const greeterScene = new Scene("greeter");
greeterScene.enter(() => console.log("Hi"));
greeterScene.leave(() => console.log("Bye"));
greeterScene.command("back", leave());
greeterScene.hears("hi", enter("greeter"));
greeterScene.on("message", (ctx) => {
  ctx.reply("Thank You");
  ctx.scene.leave();
});
bot.use(session());
const stage = new Stage([greeterScene]);
bot.use(stage.middleware());
bot.command("test", (ctx) => ctx.scene.enter("greeter"));
bot.command("testtttttt", (ctx) => {
  console.log(ctx.editedMessage);
  // bot.telegram
  //   .sendMessage(ctx.update.message.chat.id, `Enter City`, {
  //     parse_mode: "Markdown",
  //   })
  //   .then((info) => {
  //     console.log(info);
  //
  //     bot.on("message", (context) => {
  //       console.log(context);
  //       return context.reply("Thank you");
  //     });
  //   })
  //   .catch((err) => console.log(err));
});
// Keyboard element end

// Run Covid-19 component
bot.command(["corona", "c", "Corona", "C"], (ctx) => {
  fetchData(ctx);
});

// Run Counter-Strike Information Component
bot.command(["cs", "Cs", "CS"], (ctx) => {
  counterStrikeInfo(ctx);
});

// Manual Update Covid-9 Base
bot.command(["update", "u", "U", "Update"], (ctx) => {
  if (isAdmin(ctx.update.message.from.id)) {
    updateCovidData(bot);
  } else {
    return ctx.reply(
      `@${
        ctx.update.message.from.username
          ? ctx.update.message.from.username
          : ctx.update.message.from.first_name
      }, You have no permissions to run this command!`
    );
  }
});

// Gallery
bot.command(["gallery", "Gallery", "G", "g"], (ctx) => {
  gallery(ctx, bot);
});

// Google Translator
bot.command(["translate", "Translate", "T", "t"], (ctx) => {
  translator(ctx, bot);
});

// Pin Message in group
bot.command(["pin"], (ctx) => {
  if (isAdmin(ctx.update.message.from.id)) {
    pinMessage(ctx, bot);
  } else {
    return ctx.reply(
      `@${
        ctx.update.message.from.username
          ? ctx.update.message.from.username
          : ctx.update.message.from.first_name
      }, You have no permissions to run this command!`
    );
  }
});

// Weather component
bot.command(["w", "W", "weather", "Weather"], (ctx) => {
  weather(ctx, bot);
});

//
// test
// bot.hears(["test"], (ctx) => {
//   console.log(ctx.update.message.from.id);
//   gallery(ctx);
// });

// Run Bad Words Filter Component
// badWordsFilter(bot);

bot.launch();
