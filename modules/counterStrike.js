const counterStrikeInfo = (ctx) => {
  const text =
    "Counter-Strike Server IP: *104.199.71.150:27015*\n" +
    "Half-Life Server IP: *34.77.193.114:27015*\n" +
    "Команда коннекта из консоли: ` connect 34.77.193.114:27015;` \n" +
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
};

module.exports = { counterStrikeInfo };
