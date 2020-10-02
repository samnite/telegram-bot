const { parseReq } = require("../../util/utility");
const db = require("../db").mysql_pool;
const moment = require("moment");
const { amountFormat } = require("../../util/utility");

const fetchData = (ctx, button = false) => {
	let text = parseReq(ctx.update.message.text);
	if (text.length > 1) text = text.toLowerCase();
	db.getConnection(function (err, connection) {
		if (text.length === 1 || button) {
			connection.query("SELECT * FROM covid_global WHERE id = 1", (err, res) => {
				if (err) console.log(err);
				const {
					total_confirmed,
					new_confirmed,
					total_deaths,
					new_deaths,
					total_recovered,
					new_recovered,
					date,
				} = res[0];
				return ctx.reply(
					`@${
						ctx.update.message.from.username
							? ctx.update.message.from.username
							: ctx.update.message.from.first_name
					},
	COVID-19 Worldwide statistics:
	Confirmed cases: <b>${amountFormat(total_confirmed, ",")}</b> (+<i>${amountFormat(
						new_confirmed,
						","
					)}</i>)
	Death cases: <b>${amountFormat(total_deaths, ",")}</b> (+<i>${amountFormat(new_deaths, ",")}</i>)
	Recovered: <b>${amountFormat(total_recovered, ",")}</b> (+<i>${amountFormat(
						new_recovered,
						","
					)}</i>)
	Base updated: <b>${moment(date).format("LLL")}</b>
	         `,
					{
						parse_mode: "HTML",
					}
				);
			});
		} else if (text.length > 1) {
			connection.query(`SELECT * FROM covid_countries WHERE slug = '${text}'`, (err, res) => {
				if (err) console.log(err);
				if (!res.length) {
					return ctx.reply(
						`@${
							ctx.update.message.from.username
								? ctx.update.message.from.username
								: ctx.update.message.from.first_name
						}, No country found... `
					);
				} else {
					const {
						total_confirmed,
						new_confirmed,
						total_deaths,
						new_deaths,
						total_recovered,
						new_recovered,
					} = res[0];
					return ctx.reply(
						`@${
							ctx.update.message.from.username
								? ctx.update.message.from.username
								: ctx.update.message.from.first_name
						},
Statistics by country <b>${text[0].toUpperCase() + text.slice(1)}</b>:
Confirmed cases: <b>${amountFormat(total_confirmed, ",")}</b> (+<i>${amountFormat(
							new_confirmed,
							","
						)}</i>)
Death cases: <b>${amountFormat(total_deaths, ",")}</b> (+<i>${amountFormat(new_deaths, ",")}</i>)
Recovered: <b>${amountFormat(total_recovered, ",")}</b> (+<i>${amountFormat(
							new_recovered,
							","
						)}</i>)
                   `,
						{
							parse_mode: "HTML",
						}
					);
				}
			});
		}
	});
};

module.exports = { fetchData };
