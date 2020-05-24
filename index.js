const { Telegraf } = require("telegraf");
const axios = require("axios");
const { fetchData } = require("./components/covid");
const { counterStrikeInfo } = require("./components/counterStrike");
const { badWordsFilter } = require("./components/badWordsFilter");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.command(["corona", "c"], (ctx) => {
  fetchData(ctx);
});

bot.command(["cs", "cs@SamniteBot"], (ctx) => {
  counterStrikeInfo(ctx);
});

badWordsFilter(bot);

bot.launch();
