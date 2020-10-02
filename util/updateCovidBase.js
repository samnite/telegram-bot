const axios = require("axios");
const db = require("../modules/db").mysql_pool;

const updateCovidData = async (ctx) => {
  const data = await axios
    .get("https://api.covid19api.com/summary")
    .then((res) => res.data)
    .catch((err) => console.log(err));
  if (data) {
    db.getConnection(function (err, connection) {
      connection.query(
        `UPDATE covid_global SET new_confirmed = ${data.Global.NewConfirmed}, total_confirmed = ${data.Global.TotalConfirmed}, new_deaths = ${data.Global.NewDeaths}, total_deaths = ${data.Global.TotalDeaths}, new_recovered = ${data.Global.NewRecovered}, total_recovered = ${data.Global.TotalRecovered} WHERE id = 1`,
        (err) => console.log(err)
      );
    });
  }
};

module.exports = { updateCovidData };
