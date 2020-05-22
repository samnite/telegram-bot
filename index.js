const { Telegraf } = require('telegraf');

const bot = new Telegraf('1225000134:AAGgX9tBvaHbe08P3fIjpPAuYbq7Dy3T4QU')
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))



bot.hears('хуй', (ctx) => ctx.reply('Нехуй материться, блять!'))
bot.hears('cs', (ctx) => ctx.reply('Counter-Strike Server IP: 104.199.71.150:27015\n' +
  'Half-Life Server IP: 34.77.193.114:27015\n' +
  'Специально для панка (Mac), команда коннекта: connect 34.77.193.114:27015; password 9432\n' +
  '\n' +
  'Win client - https://down-cs.su/clean.php\n' +
  'Mac client - https://rutracker.org/forum/viewtopic.php?t=5239713\n' +
  '\n' +
  'Доступ к админке:\n' +
  '- меняем ник на admin\n' +
  '- в консоли: \n' +
  'setinfo "_pw" "7184109"\n' +
  '- в консоли (меню ботов): \n' +
  'amx_pbmenu\n' +
  '- в консоли (меню сервера): \n' +
  'amxmodmenu\n' +
  '\n' +
  '- Смена карты (для халвы): \n' +
  'amx_map MAP_NAME\n' +
  ' \n' +
  '\n' +
  ' Конфа: https://meet.jit.si/cs16'))

bot.launch()