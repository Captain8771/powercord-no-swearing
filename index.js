const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { messages } = require("powercord/webpack");
const wordList = require("./words").words;

module.exports = class RemoveSwearWords extends Plugin {
	async startPlugin() {
		inject("removeSwearWords", messages, "sendMessage", (message) => {
			const swearWords = wordList;

			let swearsRemoved = 0;
			let latestSwear = "";

			for (const word of swearWords) {
				const regex = new RegExp(word, "gim");
				if (regex.test(message[1].content)) {
					swearsRemoved += message[1].content.match(regex).length;
					latestSwear = word;
				}

				message[1].content = message[1].content.replaceAll(regex, "🤬");
			}

			if (swearsRemoved == 1) {
				setTimeout(
					() =>
						this.sendEphemeralMessage(
							`Please don't swear you ${latestSwear}`
						),
					100
				);
			}

			if (swearsRemoved > 1) {
				setTimeout(
					() =>
						this.sendEphemeralMessage(
							`Hey! Don't swear! I just had to remove ${swearsRemoved} bad words from that message, before I could send it.`
						),
					100
				);
			}
		});
	}

	pluginWillUnload() {
		uninject("removeSwearWords");
	}

	// this is from Little Furret#7901, https://canary.discord.com/channels/538759280057122817/755005784999329883/948454258603331584
	getModule(name) {
		var module;
		webpackChunkdiscord_app.push([
			[Math.random()],
			{},
			(r) => {
				module =
					module ||
					Object.values(r.c).find(
						(m) => m?.exports?.default && m.exports.default[name]
					);
			}
		]);
		return module;
	}

	// guess who basically made this! https://canary.discord.com/channels/538759280057122817/755015856945102891/948455712953106433
	sendEphemeralMessage(content) {
		this.getModule("sendMessage").exports.default.sendBotMessage(
			this.getModule(
				"getLastSelectedChannelId"
			).exports.default.getChannelId(),
			content
		);
	}
};
