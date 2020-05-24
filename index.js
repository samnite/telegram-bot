const { Telegraf } = require("telegraf");
const { fetchData } = require("./components/covid");
const { counterStrikeInfo } = require("./components/counterStrike");
const { badWordsFilter } = require("./components/badWordsFilter");
const fs = require("fs");
const path = require("path");
const file = require("./covidInfo.json");
// const testFile = require("./testFile.json");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

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
  // const data = {
  //   id: 2,
  //   name: "sam",
  // };
  // console.log(file.Global);
  // const data = file;
  // fs.writeFile("./testFile.json", data, (err) => console.log(err));
  // console.log(file.Global);
  // let test = JSON.parse(testFile);
  // console.log(test);
  return ctx.reply("Hey there");
});

// Run Bad Words Filter Component
badWordsFilter(bot);

bot.launch();
