import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedField, GuildMember } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { isAllowed, prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";

import { DiscordCommand } from "../types/discordEvents";

const showBannedWordsList: DiscordCommand = {
	data: new SlashCommandBuilder().setName("liste_mots").setDescription("Affiche la liste des mots bannis"),
	execute: async interaction => {
		if (!isAllowed(interaction.member as GuildMember | undefined)) {
			return await replyToInteraction(
				interaction,
				prepareEmbed(interaction.user)
					.setTitle("Valve thermostatique générale")
					.setDescription("🚫 | Eh oh, tu t'es pris pour qui, Carolo ? Revois tes droits avant de faire ça.")
			);
		}

		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];

		await replyToInteraction(
			interaction,
			prepareEmbed(interaction.user)
				.setTitle("Valve thermostatique textuelle")
				.setDescription(
					words.length ? "Voici la liste des mots interdits :" : "Il n'y a pas de mots dans la liste"
				)
				.setFields(
					words.map(
						(word, index) =>
							<EmbedField>{
								name: `${index + 1}`,
								value: word.word,
								inline: false
							}
					)
				)
		);
	}
};

module.exports = showBannedWordsList;
