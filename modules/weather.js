const axios = require("axios");
const { sendMessage } = require("../util/send-message");
const { parseReq } = require("../util/utility");
const moment = require("moment");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const weather = (ctx, bot) => {
  const text = parseReq(ctx.update.message.text);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`;
  if (text.length > 1) {
    axios
      .get(encodeURI(url))
      .then(({ data }) => {
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        console.log(moment(data.sys.sunrise * 1000).format());
        const info = `@${
          ctx.update.message.from.username
            ? ctx.update.message.from.username
            : ctx.update.message.from.first_name
        },
Weather of *${data.name} (${data.sys.country})*:
🌡️Temp: *${data.main.temp}°C* _(feels like ${data.main.feels_like}_°C)
💧Humidity: ${data.main.humidity} %
☁️Cloudiness: ${data.weather[0].description} (${data.clouds.all}%)
💨Wind: ${data.wind.speed} m/s
🌅Sunrise: ${moment(sunrise).format("HH:mm")} 
🌇Sunset: ${moment(sunset).format("HH:mm")} 
                 `;
        return ctx.replyWithPhoto(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
          { caption: info, parse_mode: "Markdown" }
        );
      })
      .catch((err) => {
        console.log(err.message);
        sendMessage(ctx, bot, err.message);
      });
  } else {
    const msg = `please type your request to get weather in format */weather city_name*, example: \` /weather London\``;
    sendMessage(ctx, bot, msg);
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
