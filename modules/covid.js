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
Confirmed cases: *${TotalConfirmed}* (+_${NewConfirmed}_)
Death cases: *${TotalDeaths}* (+_${NewDeaths}_)
Recovered: *${TotalRecovered}* (+_${NewRecovered}_)        
        ${
          country
            ? `
Statistics by country *${text[0].toUpperCase() + text.slice(1)}*:
Confirmed cases: *${country.TotalConfirmed}* (+_${country.NewConfirmed}_)
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
