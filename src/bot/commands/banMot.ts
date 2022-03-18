import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { macros } from "../../helpers/macros";
import { string } from "../../helpers/string";

import { DiscordClient } from "../types/discordClient";
import { DiscordCommand } from "../types/discordEvents";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mots_interdits")
		.setDescription("Gère la liste de mots bannis de tous les serveurs administrés par le Thermostat")
		.addSubcommand(
			(subcommand) =>
				subcommand
					.setName("interdire")
					.setDescription("Bannit le mot ou la phrase spécifié(e)")
					.addStringOption(
						(option) =>
							option
								.setName("mot")
								.setDescription("Le mot à bannir")
								.setRequired(true)
					)
		)
		.addSubcommand(
			(subcommand) =>
				subcommand
					.setName("permettre")
					.setDescription("Permet le mot ou la phrase spécifié(e)")
					.addStringOption(
						(option) =>
							option
								.setName("mot")
								.setDescription("Le mot à permettre")
								.setRequired(true)
					)
		)
		.addSubcommand(
			(subcommand) =>
				subcommand
					.setName("liste")
					.setDescription("Affiche la liste des mots bannis")
		)
	,
	execute: async (interaction) => {
		const toHandle = interaction.options.getString("mot");
		const words = (DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[]);
		const filteredWords = words.filter((obj) => string.normalized(obj.word) === string.normalized(toHandle || ""));

		if (interaction.options.getSubcommand() === "interdire") {
			if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
				return;

			if (filteredWords.length) {
				if (words[0].enabled)
					return;

				const updateStatement = DiscordClient.database.prepare(
					// eslint-disable-next-line max-len
					"update banned_words set enabled = (@enabled), update_date = datetime('now', 'localtime') where id = (@id);"
				);

				DiscordClient.database.transaction(() => {
					updateStatement.run(
						{
							enabled: 1,
							id: words[0].id
						}
					);
				})();
			} else {
				const insertStatement = DiscordClient.database.prepare("insert into banned_words(word) values (?)");
				DiscordClient.database.transaction(() => {
					insertStatement.run(toHandle);
				})();
			}

			await macros.replyToInteraction(interaction, "Liste des mots interdits mise à jour");
		} else if (interaction.options.getSubcommand() === "permettre") {
			if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
				return;

			if (filteredWords.length && words[0].enabled) {
				const updateStatement = DiscordClient.database.prepare(
					// eslint-disable-next-line max-len
					"update banned_words set enabled = (@enabled), update_date = datetime('now', 'localtime') where id = (@id);"
				);

				DiscordClient.database.transaction(() => {
					updateStatement.run(
						{
							enabled: 0,
							update_date: new Date().toLocaleTimeString(),
							id: words[0].id
						}
					);
				})();

				await macros.replyToInteraction(interaction, "Mot correctement mis à jour");
			}
		} else if (interaction.options.getSubcommand() === "liste") {
			const list = words
				.map(wordData => `- "${wordData.word}" - actif : ${wordData.enabled ? "oui" : "non"}`)
				.join("\n");

			await macros.replyToInteraction(
				interaction,
				list.length ? `Voici la liste des mots interdits :\n${list}` : "Il n'y a pas de mots dans la liste"
			);
		}
	}
} as DiscordCommand;
