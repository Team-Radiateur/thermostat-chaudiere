import { Message } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { logger } from "../../helpers/logger";
import { string } from "../../helpers/string";

import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message: Message) => {
		if (message.author.bot) return;

		logger.info(`${message.author.username}#${message.author.discriminator} a écrit "${message}"`);

		if (
			(DiscordClient.database.prepare("select * from main.banned_words;").all() as BannedWord[]).filter(
				wordData => wordData.enabled &&
					string.normalized(message.content).includes(string.normalized(wordData.word))).length
		) {
			// eslint-disable-next-line max-len
			const reply = await message.reply(`Oulàlà... la Chaudière n'aime pas que tu envoies une telle chose dans le circuit du Radiateur...`);
			await message.delete();

			setTimeout(async () => {
				await reply.delete();
			}, 5000);
		}
	}
} as DiscordEvent;
