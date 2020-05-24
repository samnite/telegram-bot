const axios = require("axios");
const fs = require("fs");

const fetchData = (ctx) => {
  let text = ctx.update.message.text.split(" ")[1];
  if (text) text = text.toLowerCase();

  fs.readFile("./covidInfo.json", function readFileCallback(err, data) {
    if (err) {
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, Превышен интервал обращений к серверу, попробуй позже `
      );
    } else {
      const covidData = JSON.parse(data);
      console.log(covidData.Global);
      const {
        NewConfirmed,
        TotalConfirmed,
        NewDeaths,
        TotalDeaths,
        NewRecovered,
        TotalRecovered,
      } = covidData.Global;
      const country = covidData.Countries.find(
        (country) => country.Slug === text
      );
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, 
        COVID-19 Worldwide statistics:
        Confirmed cases: *${TotalConfirmed}* (+_${NewConfirmed}_)
        Death cases: *${TotalDeaths}* (+_${NewDeaths}_)
        Recovered: *${TotalRecovered}* (+_${NewRecovered}_)
        
        ${
          country
            ? `Statistics by country *${text[0].toUpperCase() + text.slice(1)}*:
        Confirmed cases: *${country.TotalConfirmed}* (+_${
                country.NewConfirmed
              }_)
        Death cases: *${country.TotalDeaths}* (+_${country.NewDeaths}_)
        Recovered: *${country.TotalRecovered}* (+_${country.NewRecovered}_)
         `
            : ""
        }
         `,
        {
          parse_mode: "markdown",
        }
      );
    }
  });
};

module.exports = { fetchData };
