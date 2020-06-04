const counterStrikeInfo = (ctx) => {
  const text =
    "Counter-Strike Server IP: *104.199.71.150:27015*\n" +
    "Half-Life Server IP: *34.77.193.114:27015*\n" +
    "Команда коннекта из консоли: ` connect 34.77.193.114:27015;` \n\n" +
    "*Полезные ссылки:*\n" +
    "[Скачать клиент (Windows)](https://down-cs.su/clean.php)\n" +
    "[Скачать клиент (Mac)](https://rutracker.org/forum/viewtopic.php?t=5239713)\n" +
    "[Голосовая конференция](https://meet.jit.si/cs16)\n\n" +
    "*Доступ к админке*:\n" +
    "- меняем ник на *admin*\n" +
    "- в консоли (меню ботов): ` amx_pbmenu`\n" +
    "- в консоли (меню сервера): ` amxmodmenu`\n" +
    "\n" +
    "- Смена карты : ` amx_map MAP_NAME` \n" +
    "- Серверные команды: ` amx_rcon COMAND` \n   (пример: `amx_rcon mp_roundtime 3`)";
  return ctx.reply(text, {
    parse_mode: "markdown",
    disable_web_page_preview: true,
  });
};

module.exports = { counterStrikeInfo };
