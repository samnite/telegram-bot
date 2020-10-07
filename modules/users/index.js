const db = require("../db").mysql_pool;

const addUserToBase = (ctx) => {
	const { message } = ctx.update;
	db.getConnection((err, connection) => {
		connection.query(
			`INSERT INTO users (user_id, username, first_name, last_name, is_admin) VALUES (${
				message.from.id
			}, '${message.from.username}', '${message.from.first_name}', '${
				message.from.last_name
			}', ${0}) ON DUPLICATE KEY UPDATE user_id = user_id`,
			(err, res) => console.log(res)
		);
	});
};

module.exports = { addUserToBase };
