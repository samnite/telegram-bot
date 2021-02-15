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

const globalGroupStats = (ctx) => {
	db.getConnection((err, connection) => {
		const { message } = ctx.update;
		connection.query(`SELECT * FROM messages WHERE group_id = ${message.chat.id}`, (err, res) => {
			const data = res;
			const stats = {};
			let msgString = "";
			if (data) {
				let curUser = "";
				data.forEach((msg) => {
					if (msg.user_id !== curUser) {
						if (stats.hasOwnProperty(msg.user_id)) {
							stats[msg.user_id] = {
								...stats[msg.user_id],
								count: stats[msg.user_id].count + 1,
							};
						} else {
							stats[msg.user_id] = {
								count: 1,
								username: msg.username,
								firstName: msg.first_name,
								lastName: msg.last_name,
							};
						}
						curUser = msg.user_id;
					} else {
						stats[msg.user_id] = {
							...stats[msg.user_id],
							count: stats[msg.user_id].count + 1,
						};
					}
				});
			}
			Object.values(stats)
				.sort((a, b) => a.count - b.count)
				.reverse()
				.map((user, idx) => {
					console.log('index', idx);
					if (idx <= 9) {
						msgString +=
							`<b>${idx + 1}</b>. ${user.username !== "undefined" ? `@${user.username}` : ""} ${
								user.firstName && user.firstName
							} ${user.lastName !== "undefined" ? user.lastName : ""} 💬️ <b>${user.count}</b>` +
							"\n";
					}
				});
			const output = `<b>Top-${Object.values(stats).length - 1}</b> active users in <i>"${
				message.chat.title
			}"</i> community:
${msgString}
			`;
			sendMessage(ctx, output, true, false);
		});
	});
};

module.exports = { messageCounter, messageStats, globalGroupStats };
