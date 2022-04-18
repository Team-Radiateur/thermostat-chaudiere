import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

import { DiscordCommand } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { macros } from "../../helpers/macros";
import { string } from "../../helpers/string";

const allowWord: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("permettre_mot")
		.setDescription("Permet le mot ou la phrase spécifié(e)")
		.addStringOption(option =>
			option.setName("mot").setDescription("Le mot à permettre").setRequired(true)
		) as SlashCommandBuilder,
	execute: async interaction => {
		if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
			return await macros.replyToInteraction(
				interaction,
				"Tout doux, bijou... T'as cru que t'avais le droit de faire ça ?",
				true
			);

		const toHandle = interaction.options.getString("mot");
		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];
		const filteredWords = words.filter(obj => string.normalized(obj.word) === string.normalized(toHandle || ""));

		if (filteredWords.length && words[0].enabled) {
			const updateStatement = DiscordClient.database.prepare(
				// eslint-disable-next-line max-len
				"update banned_words set enabled = (@enabled), update_date = datetime('now', 'localtime') where id = (@id);"
			);

			DiscordClient.database.transaction(() => {
				updateStatement.run({
					enabled: 0,
					update_date: new Date().toLocaleTimeString(),
					id: words[0].id
				});
			})();

			await macros.replyToInteraction(interaction, "Mot correctement mis à jour");
		}
	}
};

module.exports = allowWord;
