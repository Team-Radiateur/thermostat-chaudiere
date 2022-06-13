import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedFieldData, Permissions } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";

import { DiscordCommand } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

const showBannedWordsList: DiscordCommand = {
	data: new SlashCommandBuilder().setName("liste_mots").setDescription("Affiche la liste des mots bannis"),
	execute: async interaction => {
		if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) return;

		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];

		await replyToInteraction(
			interaction,
			prepareEmbed(interaction.user)
				.setTitle("Liste des mots bannis")
				.setDescription(
					words.length ? "Voici la liste des mots interdits :" : "Il n'y a pas de mots dans la liste"
				)
				.setFields(
					words.map(
						(word, index) =>
							<EmbedFieldData>{
								name: `${index + 1}`,
								value: word.word
							}
					)
				)
		);
	}
};

module.exports = showBannedWordsList;
