import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { replyToInteraction } from "../../helpers/macros";
import { string } from "../../helpers/string";

import { DiscordClient } from "../types/discordClient";
import { DiscordCommand } from "../types/discordEvents";

const banWord: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("ban_word")
		.setDescription("Bannit le mot ou la phrase spécifié(e) de tous les serveurs administrés par le Thermostat")
		.addStringOption(option =>
			option.setName("mot").setDescription("Le mot à bannir").setRequired(true)
		) as SlashCommandBuilder,
	execute: async interaction => {
		if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) {
			return await replyToInteraction(interaction, "Eh oh, tu t'es pris pour qui, Carolo ?");
		}

		const toHandle = interaction.options.getString("mot");
		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];
		const filteredWords = words.filter(obj => string.normalized(obj.word) === string.normalized(toHandle || ""));

		if (filteredWords.length) {
			if (words[0].enabled) return;

			const updateStatement = DiscordClient.database.prepare(
				// eslint-disable-next-line max-len
				"update banned_words set enabled = (@enabled), update_date = datetime('now', 'localtime') where id = (@id);"
			);

			DiscordClient.database.transaction(() => {
				updateStatement.run({
					enabled: 1,
					id: words[0].id
				});
			})();
		} else {
			const insertStatement = DiscordClient.database.prepare("insert into banned_words(word) values (?)");
			DiscordClient.database.transaction(() => {
				insertStatement.run(toHandle);
			})();
		}

		return await replyToInteraction(interaction, "Liste des mots interdits mise à jour");
	}
};

module.exports = banWord;
