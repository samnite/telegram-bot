const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.command("corona", (ctx) => {
  console.log(ctx.update);
  axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      const {
        NewConfirmed,
        TotalConfirmed,
        NewDeaths,
        TotalDeaths,
        NewRecovered,
        TotalRecovered,
      } = res.data.Global;
      console.log(res.data.Global);
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, 
        Статистика по коронавирусу в мире на данный момент:
        Зарегистрировано случаев: *${TotalConfirmed}* (+_${NewConfirmed}_)
        Смертельных случаев: *${TotalDeaths}* (+_${NewDeaths}_)
        Выздоровело: *${TotalRecovered}* (+_${NewRecovered}_)
         `,
        {
          parse_mode: "markdown",
        }
      );
    })
    .catch((err) => {
      //
      console.log(err.response);
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, Превышен интервал обращений к серверу, попробуй позже (Ошибка: ${
          err.response.status
        } - ${err.response.statusText})`
      );
    });
});

bot.command(["cs", "cs@SamniteBot"], (ctx) => {
  const text =
    "Counter-Strike Server IP: *104.199.71.150:27015*\n" +
    "Half-Life Server IP: *34.77.193.114:27015*\n" +
    "Команда коннекта из консоли: ```connect 34.77.193.114:27015;``` \n" +
    "*Полезные ссылки:*\n" +
    "[Скачать клиент (Windows)](https://down-cs.su/clean.php)\n" +
    "[Скачать клиент (Mac)](https://rutracker.org/forum/viewtopic.php?t=5239713)\n" +
    "[Голосовая конференция](https://meet.jit.si/cs16)\n\n" +
    "*Доступ к админке*:\n" +
    "- меняем ник на *admin*\n" +
    "- в консоли (меню ботов): \n" +
    "```amx_pbmenu```\n" +
    "- в консоли (меню сервера): \n" +
    "```amxmodmenu```\n" +
    "\n" +
    "- Смена карты (для халвы): \n" +
    "```amx_map MAP_NAME```";
  return ctx.reply(text, {
    parse_mode: "markdown",
    disable_web_page_preview: true,
  });
});

bot.hears(
  /\w{0,5}[хx]([хx\s\!@#\$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#\$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#\$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#\$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#\$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#\$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#\$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#\$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#\$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#\$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#\$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#\$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#\$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#\$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#\$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#\$%\^&*+-\|\/]{0,6})[рr]\w{0,12}/i,
  (ctx) => {
    // console.log(ctx);
    return ctx.reply(
      `@${
        ctx.update.message.from.username
          ? ctx.update.message.from.username
          : ctx.update.message.from.first_name
      }, Нехуй материться, блять!`
    );
  }
);

bot.launch();
