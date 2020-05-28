const { Telegraf } = require("telegraf");
const { fetchData } = require("./components/covid");
const { counterStrikeInfo } = require("./components/counterStrike");
const { badWordsFilter } = require("./components/badWordsFilter");
const { gallery } = require("./components/gallery");
const { translator } = require("./components/translator");
const { updateCovidData } = require("./util/updateCovidBase");
const { isAdmin } = require("./util/utility");
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

// Cron task
const job = new CronJob("0 0 */6 * * *", function () {
  // Update Covid-19 Database
  updateCovidData(bot);
});
job.start();

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

// test
// bot.hears(["test"], (ctx) => {
//   console.log(ctx.update.message.from.id);
//   gallery(ctx);
// });

// Run Bad Words Filter Component
badWordsFilter(bot);

bot.launch();
