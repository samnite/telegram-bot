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
const { weatherScene } = require("./modules/scenes");
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

// Cron task
const job = new CronJob("0 0 */8 * * *", function () {
  // Update Covid-19 Database
  updateCovidData(bot);
});
job.start();

// Greeter scene
bot.use(session());
const stage = new Stage([weatherScene]);
bot.use(stage.middleware());

bot.command(["test", "wb"], (ctx) => ctx.scene.enter("weather"));

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
    updateCovidData(ctx);
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
  gallery(ctx);
});

// Google Translator
bot.command(["translate", "Translate", "T", "t"], (ctx) => {
  translator(ctx);
});

// Pin Message in group
bot.command(["pin"], (ctx) => {
  if (isAdmin(ctx.update.message.from.id)) {
    pinMessage(ctx);
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
  weather(ctx);
});

// Run Bad Words Filter Component
// badWordsFilter(bot);

bot.launch();
