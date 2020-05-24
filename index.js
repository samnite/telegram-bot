const { Telegraf } = require("telegraf");
const { fetchData } = require("./components/covid");
const { counterStrikeInfo } = require("./components/counterStrike");
const { badWordsFilter } = require("./components/badWordsFilter");
const axios = require("axios");
const fs = require("fs");
const { updateCovidData } = require("./util/updateCovidBase");
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

// Cron task
const job = new CronJob("0 */59 * * * *", function () {
  // Update Covid-19 Database
  updateCovidData(bot);
});
job.start();

// Run Covid-19 component
bot.command(["corona", "c"], (ctx) => {
  fetchData(ctx);
});

// Run Counter-Strike Information Component
bot.command(["cs", "cs@SamniteBot"], (ctx) => {
  counterStrikeInfo(ctx);
});

// Manual Update Covid-9 Base
bot.command(["update", "u"], (ctx) => {
  updateCovidData(bot);
  // return ctx.reply("Hey there");
});

// Run Bad Words Filter Component
badWordsFilter(bot);

bot.launch();
