const axios = require("axios");
const fs = require("fs");

const updateCovidData = (bot) => {
  axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      const date = new Date();

      // Send Message
      bot.telegram
        .sendMessage(
          "-1001307324588",
          `Covid-19 Database Update Successfully: ${date}`
        )
        .then((info) => console.log(info))
        .catch((err) => console.log(err));
      // Write file to server
      const data = JSON.stringify(res.data);
      fs.writeFile("./covidInfo.json", data, (i) => console.log(i));
    })
    .catch((err) => console.log(err));
};

module.exports = { updateCovidData };
