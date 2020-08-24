const counterStrikeInfo = (ctx) => {
  const text =
    "Counter-Strike Server IP: *CLOSED*\n" +
    "Half-Life Server IP: *CLOSED*\n";
  return ctx.reply(text, {
    parse_mode: "markdown",
    disable_web_page_preview: true,
  });
};

module.exports = { counterStrikeInfo };
