const db = require("../modules/db").mysql_pool;

const messageCounter = (ctx) => {
	const { message } = ctx.update;
	db.getConnection((err, connection) => {
		connection.query(
			`INSERT INTO messages (message_id, group_id, user_id, first_name, last_name, username) VALUES (${message.message_id}, ${message.chat.id}, ${message.from.id}, '${message.from.first_name}', '${message.from.last_name}', '${message.from.username}')`,
			(err) => console.log(err)
		);
	});
};

module.exports = messageCounter;
