const fs = require("fs");
const { parseReq } = require("../util/utility");

const fetchData = (ctx) => {
  let text = parseReq(ctx.update.message.text);
  if (text.length > 1) text = text.toLowerCase();

  fs.readFile("./db/covidInfo.json", function readFileCallback(err, data) {
    if (err) {
      return ctx.reply(
        `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        }, Something went wrong... `
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
Confirmed cases: <b>${TotalConfirmed}</b> (+<i>${NewConfirmed}</i>)
Death cases: <b>${TotalDeaths}</b> (+<i>${NewDeaths}</i>)
Recovered: <b>${TotalRecovered}</b> (+<i>${NewRecovered}</i>)        
        ${
          country
            ? `
Statistics by country <b>${text[0].toUpperCase() + text.slice(1)}</b>:
Confirmed cases: <b>${country.TotalConfirmed}</b> (+<i>${
                country.NewConfirmed
              }</i>)
Death cases: <b>${country.TotalDeaths}</b> (+<i>${country.NewDeaths}</i>)
Recovered: <b>${country.TotalRecovered}</b> (+<i>${country.NewRecovered}</i>)
         `
            : ""
        }
         `,
        {
          parse_mode: "HTML",
        }
      );
    }
  });
};

module.exports = { fetchData };
