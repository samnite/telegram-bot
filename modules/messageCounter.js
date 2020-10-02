const db = require("../modules/db").mysql_pool;
const { sendMessage } = require("../util/send-message");

const messageCounter = (ctx) => {
	const { message } = ctx.update;
	db.getConnection((err, connection) => {
		connection.query(
			`INSERT INTO messages (message_id, group_id, user_id, first_name, last_name, username) VALUES (${message.message_id}, ${message.chat.id}, ${message.from.id}, '${message.from.first_name}', '${message.from.last_name}', '${message.from.username}')`,
			(err) => console.log(err)
		);
	});
};

const messageStats = (ctx) => {
	db.getConnection((err, connection) => {
		const { message } = ctx.update;
		connection.query(
			`SELECT COUNT(message_id) AS count FROM messages WHERE group_id = ${message.chat.id} AND user_id = ${message.from.id}`,
			(err, res) => sendMessage(ctx, `You wrote <b>${res[0].count}</b> posts on this group.`)
		);
	});
};

module.exports = { messageCounter, messageStats };
