const axios = require("axios");
const { sendMessage } = require("../util/send-message");
const { parseReq } = require("../util/utility");
const moment = require("moment");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const weather = (ctx, isButton = false) => {
  const text = parseReq(ctx.update.message.text);
  const url = isButton
    ? `https://api.openweathermap.org/data/2.5/weather?q=${ctx.update.message.text}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`
    : `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`;
  if (text.length > 1) {
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

        const info = `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        },
Weather of *${data.name} (${data.sys.country})*:
🌡️Temp: *${Math.round(data.main.temp)}°C* _(feels like ${Math.round(
          data.main.feels_like
        )}_°C)
💧Humidity: ${data.main.humidity} %
☁️Cloudiness: ${data.weather[0].description} (${data.clouds.all}%)
💨Wind: ${data.wind.speed} m/s
🕒Local time: ${localTime}
🌅Sunrise: ${sunrise} 
🌇Sunset: ${sunset} 
[See More...➡️](https://openweathermap.org/city/${data.id})
                 `;
        return ctx.replyWithPhoto(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
          { caption: info, parse_mode: "Markdown" }
        );
      })
      .catch((err) => {
        console.log(err.response);
        sendMessage(ctx, `⚠️ ${err.response.data.message}`);
      });
  } else {
    sendMessage(
      ctx,
      `please type your request to get weather in format */weather city_name*, example: \` /weather London\``
    );
  }

  // const keyboard = {
  //   keyboard: [
  //     [
  //       {
  //         text: "Get Weather",
  //         callback_data: () => {
  //           console.log(test);
  //         },
  //         request_location: true,
  //       },
  //       {
  //         text: "COVID-19 Info",
  //         callback_data: { message: "/corona", from: ctx.update.from },
  //       },
  //     ],
  //     ["Cancel"],
  //   ],
  //   one_time_keyboard: true,
  // };
  // bot.telegram
  //   .sendMessage(ctx.update.message.chat.id, "Send you location", {
  //     reply_markup: keyboard,
  //   })
  //   .then((res) => {
  //     // bot.once();
  //     console.log(res);
  //   });
};

module.exports = { weather };