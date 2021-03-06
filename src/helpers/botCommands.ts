import { Message, Permissions } from "discord.js";
import { logger } from "./logger";
import { DiscordClient } from "../bot/types/discordClient";
import { BannedWord } from "../databases/sqlite/bannedWord";
import { string } from "./string";
import { prepareEmbed } from "./macros";

export const filter = async (message: Message) => {
	if (!message.author.bot) {
		logger.info(`${message.author.username}#${message.author.discriminator} a écrit "${message}"`);
	}

	if (
		message.author.bot ||
		message.member?.permissions?.has(Permissions.FLAGS.ADMINISTRATOR) ||
		message.member?.permissions?.has(Permissions.FLAGS.MANAGE_ROLES)
	) {
		return;
	}

	if (
		(DiscordClient.database.prepare("select * from main.banned_words;").all() as BannedWord[]).filter(
			wordData =>
				wordData.enabled && string.normalized(message.content).includes(string.normalized(wordData.word))
		).length
	) {
		const reply = await message.reply({
			embeds: [
				prepareEmbed(message.author)
					.setTitle("Valve thermostatique textuelle")
					.setDescription("Oulàlà... tu ne peux pas envoyer une telle chose dans le circuit du Radiateur...")
			]
		});
		await message.delete();

		setTimeout(async () => {
			await reply.delete();
		}, 5000);
	}
};
