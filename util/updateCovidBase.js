const axios = require("axios");
const fs = require("fs");

const updateCovidData = (ctx) => {
  axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      const date = new Date();

      // Send Message
      ctx.telegram
        .sendMessage(
          "-1001307324588",
          `Covid-19 Database Successfully Updated : ${date}`
        )
        .then((info) => console.log(info))
        .catch((err) => console.log(err));
      // Write file to server
      const data = JSON.stringify(res.data);
      fs.writeFile("./db/covidInfo.json", data, (i) => console.log(i));
    })
    .catch((err) => {
      console.log(err);
      ctx.telegram
        .sendMessage("-1001307324588", `Schedule Update failed: ${err.message}`)
        .then((info) => console.log(info))
        .catch((err) => console.log(err));
    });
};

module.exports = { updateCovidData };
