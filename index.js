const { Telegraf } = require("telegraf");
const { weather } = require("./modules/weather");
const { fetchData } = require("./modules/covid/covid");
const { pinMessage } = require("./modules/pin-message");
const { gallery } = require("./modules/gallery");
const { translator } = require("./modules/translator");
const { updateCovidData } = require("./modules/covid/updateCovidBase");
const { isAdmin } = require("./util/utility");

const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const { weatherScene, translatorScene, galleryScene } = require("./modules/scenes");
const CronJob = require("cron").CronJob;
const { Markup } = Telegraf;
const { messageCounter, messageStats, globalGroupStats } = require("./modules/messageCounter");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Cron task
const job = new CronJob("0 0 */8 * * *", function () {
	// Update Covid-19 Database
	updateCovidData(bot);
});
job.start();

// test
const mainKeyboard = Markup.keyboard([
	["⛅ Weather", Markup.locationRequestButton("⛅ Weather (autodetect)")],
	["🇺🇸 Translate", "🖼️ Gallery"], // Row1 with 2 buttons
	["🦠 Corona Info", "⌛ Soon"], // Row2 with 2 buttons
])
	.oneTime()
	.resize()
	.extra();

// Scenes
bot.use(session());
const stage = new Stage([weatherScene, translatorScene, galleryScene]);
bot.use(stage.middleware());

bot.hears("⛅ Weather", (ctx) => {
	return ctx.scene.enter("weather");
});
bot.hears("🇺🇸 Translate", (ctx) => {
	return ctx.scene.enter("translator");
});
bot.hears("🖼️ Gallery", (ctx) => {
	return ctx.scene.enter("gallery");
});
bot.hears("🦠 Corona Info", (ctx) => {
	fetchData(ctx, true);
});

bot.command(["start"], (ctx) => {
	ctx.telegram.sendMessage(ctx.from.id, `Hello ${ctx.from.first_name}`, mainKeyboard);
});

// Run Covid-19 component
bot.command(["corona", "c", "Corona", "C"], (ctx) => {
	fetchData(ctx);
});

// Manual Update Covid-9 Base
bot.command(["update", "u", "U", "Update"], (ctx) => {
	if (isAdmin(ctx.update.message.from.id)) {
		updateCovidData(ctx);
	} else {
		return ctx.reply(
			`@${
				ctx.update.message.from.username
					? ctx.update.message.from.username
					: ctx.update.message.from.first_name
			}, You have no permissions to run this command!`
		);
	}
});

// Gallery
bot.command(["gallery", "Gallery", "G", "g"], (ctx) => {
	gallery(ctx);
});

// Google Translator
bot.command(["translate", "Translate", "T", "t"], (ctx) => {
	translator(ctx);
});

// Weather component
bot.command(["w", "W", "weather", "Weather"], (ctx) => {
	weather(ctx);
});

// Show message counter by group
bot.command(["stats", "Stats"], (ctx) => {
	if (ctx.update.message.chat.type === "supergroup") {
		if (isAdmin(ctx.update.message.from.id)) {
			globalGroupStats(ctx);
		} else {
			messageStats(ctx);
		}
	}
});

bot.on("message", (ctx) => {
	if (ctx.update.message.location) {
		weather(ctx, false, ctx.update.message.location);
	}
	if (ctx.update.message.chat.type === "supergroup") {
		messageCounter(ctx);
	}
});

bot.launch();
