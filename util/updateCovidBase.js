const axios = require("axios");
const fs = require("fs");
const db = require("../modules/db").mysql_pool;

const updateCovidData = async (ctx) => {
  const data = await axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      const date = new Date();
      console.log(new Date());

      return res.data;
      // const data = JSON.stringify(res.data);
      // // console.log("Global DATA", res.data.Global);
      // // console.log("Global DATA", res.data.Date);
      // fs.writeFile("./db/covidInfo.json", data, (i) => console.log(i));
    })
    .catch((err) => {
      console.log(err);
      // ctx.telegram
      //   .sendMessage("-1001307324588", `Schedule Update failed: ${err.message}`)
      //   .then((info) => console.log(info))
      //   .catch((err) => console.log(err));
    });
  console.log(data);
  db.getConnection(function (err, connection) {
    connection.query("SELECT * FROM covid_global", (err, res) => {
      if (err) throw err;
      console.log("Result", res[0]);
    });
  });
};

module.exports = { updateCovidData };
