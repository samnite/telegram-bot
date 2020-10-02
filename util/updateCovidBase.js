const axios = require("axios");
const db = require("../modules/db").mysql_pool;
const mysql = require("mysql");

const updateCovidData = async (ctx) => {
	let values = [];
	let updateQueries = "";
	const data = await axios
		.get("https://api.covid19api.com/summary")
		.then((res) => res.data)
		.catch((err) => console.log(err));
	if (data) {
		// Update global covid info
		db.getConnection((err, connection) => {
			connection.query(
				`UPDATE covid_global SET new_confirmed = ${data.Global.NewConfirmed}, total_confirmed = ${data.Global.TotalConfirmed}, new_deaths = ${data.Global.NewDeaths}, total_deaths = ${data.Global.TotalDeaths}, new_recovered = ${data.Global.NewRecovered}, total_recovered = ${data.Global.TotalRecovered} WHERE id = 1`,
				(err) => console.log(err)
			);
		});
		// Update covid info by country
		data.Countries.forEach((el) => {
			delete el.Date;
			delete el.Premium;
			values.push(el);
		});
		values.forEach((item) => {
			updateQueries += mysql.format(
				`UPDATE covid_countries SET country = ?, country_code = ?, slug = ?, new_confirmed = ?, total_confirmed = ?, new_deaths = ?, total_deaths = ?, new_recovered = ?, total_recovered = ? WHERE country_code = ?; `,
				[
					item.Country,
					item.CountryCode,
					item.Slug,
					item.NewConfirmed,
					item.TotalConfirmed,
					item.NewDeaths,
					item.TotalDeaths,
					item.NewRecovered,
					item.TotalRecovered,
					item.CountryCode,
				]
			);
		});
		db.getConnection((err, connection) => {
			connection.query(updateQueries, (err) => console.log(err));
		});
	}
};

module.exports = { updateCovidData };
