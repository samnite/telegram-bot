const { Telegraf } = require("telegraf");
const { fetchData } = require("./components/covid");
const { counterStrikeInfo } = require("./components/counterStrike");
const { badWordsFilter } = require("./components/badWordsFilter");
const axios = require("axios");
const fs = require("fs");
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

// Cron task
const job = new CronJob("0 */10 * * * *", function () {
  const d = new Date();
  // Fetch data
  axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      // Send Message
      bot.telegram
        .sendMessage("-1001307324588", `База данных обновлена: ${d}`)
        .then((info) => console.log(info))
        .catch((err) => console.log(err));
      // Write file to server
      const data = JSON.stringify(res.data);
      fs.writeFile("./covidInfo.json", data, (i) => console.log(i));
    })
    .catch((err) => console.log(err));
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

// Tests
bot.hears("test", (ctx) => {
  return ctx.reply("Hey there");
});

// Run Bad Words Filter Component
badWordsFilter(bot);

bot.launch();
