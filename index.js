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
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

// Cron task
const job = new CronJob("0 0 */6 * * *", function () {
  // Update Covid-19 Database
  updateCovidData(bot);
});
job.start();

// // Run Covid-19 component
// bot.command(["corona", "c", "Corona", "C"], (ctx) => {
//   fetchData(ctx);
// });
//
// // Run Counter-Strike Information Component
// bot.command(["cs", "Cs", "CS"], (ctx) => {
//   counterStrikeInfo(ctx);
// });
//
// // Manual Update Covid-9 Base
// bot.command(["update", "u", "U", "Update"], (ctx) => {
//   if (isAdmin(ctx.update.message.from.id)) {
//     updateCovidData(bot);
//   } else {
//     return ctx.reply(
//       `@${
//         ctx.update.message.from.username
//           ? ctx.update.message.from.username
//           : ctx.update.message.from.first_name
//       }, You have no permissions to run this command!`
//     );
//   }
// });
//
// // Gallery
// bot.command(["gallery", "Gallery", "G", "g"], (ctx) => {
//   gallery(ctx, bot);
// });
//
// // Google Translator
// bot.command(["translate", "Translate", "T", "t"], (ctx) => {
//   translator(ctx, bot);
// });
//
// // Pin Message in group
// bot.command(["pin"], (ctx) => {
//   if (isAdmin(ctx.update.message.from.id)) {
//     pinMessage(ctx, bot);
//   } else {
//     return ctx.reply(
//       `@${
//         ctx.update.message.from.username
//           ? ctx.update.message.from.username
//           : ctx.update.message.from.first_name
//       }, You have no permissions to run this command!`
//     );
//   }
// });

// Weather component
bot.command(["w"], (ctx) => {
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
