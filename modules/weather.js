const axios = require("axios");
const { sendMessage } = require("../util/send-message");
const { isAdmin } = require("../util/utility");
const { parseReq } = require("../util/utility");
const moment = require("moment");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const weather = (ctx, isButton = false, coords) => {
  let text = coords ? "" : parseReq(ctx.update.message.text);
  const url = isButton
    ? `https://api.openweathermap.org/data/2.5/weather?q=${ctx.update.message.text}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`
    : coords
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`
    : `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`;
  console.log(text.length);
  if (text.length > 1 || coords || isButton) {
    axios
      .get(encodeURI(url))
      .then(({ data }) => {
        // Init time calculation
        const timeShift = 10800; // Your server UNIX timezone, enter 0 if using Greenwich Mean Time Zone
        const localTime = moment(
          (data.dt + data.timezone - timeShift) * 1000
        ).format("HH:mm");
        const sunrise = moment(
          (data.sys.sunrise + data.timezone - timeShift) * 1000
        ).format("HH:mm");
        const sunset = moment(
          (data.sys.sunset + data.timezone - timeShift) * 1000
        ).format("HH:mm");
        const link = `"https://openweathermap.org/city/${data.id}"`;

        const info = `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        },
Weather of <b>${data.name} (${data.sys.country})</b>:
🌡️Temp: <b>${Math.round(data.main.temp)}°C</b> <i>(feels like ${Math.round(
          data.main.feels_like
        )}</i>°C)
💧Humidity: ${data.main.humidity} %
☁️Cloudiness: ${data.weather[0].description} (${data.clouds.all}%)
💨Wind: ${data.wind.speed} m/s
🕒Local time: ${localTime}
🌅Sunrise: ${sunrise} 
🌇Sunset: ${sunset} 
<a href=${link}>See More...➡️</a>
                 `;
        return ctx.replyWithPhoto(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
          { caption: info, parse_mode: "HTML" }
        );
      })
      .catch((err) => {
        console.log(err.response);
        sendMessage(ctx, `⚠️ ${err.response.data.message}`);
      });
  } else {
    sendMessage(
      ctx,
      `please type your request to get weather in format <b>/weather city_name </b>, example: <code> /weather London</code>`
    );
  }
};

module.exports = { weather };
