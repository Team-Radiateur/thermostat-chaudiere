import { Message } from "discord.js";
import { logger } from "./logger";
import { DiscordClient } from "../bot/types/discordClient";
import { BannedWord } from "../databases/sqlite/bannedWord";
import { string } from "./string";

export const filter = async (message: Message) => {
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
};
