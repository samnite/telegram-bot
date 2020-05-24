const axios = require("axios");

const fetchData = (ctx) => {
  let text = ctx.update.message.text.split(" ")[1];
  if (text) text = text.toLowerCase();

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
      const country = res.data.Countries.find(
        (country) => country.Slug === text
      );
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
        
        ${
          country
            ? `Статистика по стране *${text[0].toUpperCase() + text.slice(1)}*:
        Зарегистрировано случаев: *${country.TotalConfirmed}* (+_${
                country.NewConfirmed
              }_)
        Смертельных случаев: *${country.TotalDeaths}* (+_${country.NewDeaths}_)
        Выздоровело: *${country.TotalRecovered}* (+_${country.NewRecovered}_)
         `
            : ""
        }
         `,
        {
          parse_mode: "markdown",
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, Превышен интервал обращений к серверу, попробуй позже `
      );
    });
};

module.exports = { fetchData };
