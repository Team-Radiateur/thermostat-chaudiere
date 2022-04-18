import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { macros } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";

const showBannedWordsList: DiscordCommand = {
	data: new SlashCommandBuilder().setName("liste_mots").setDescription("Affiche la liste des mots bannis"),
	execute: async interaction => {
		if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) return;

		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];
		const list = words
			.map(wordData => `- "${wordData.word}" - actif : ${wordData.enabled ? "oui" : "non"}`)
			.join("\n");

		await macros.replyToInteraction(
			interaction,
			list.length ? `Voici la liste des mots interdits :\n${list}` : "Il n'y a pas de mots dans la liste"
		);
	}
};

module.exports = showBannedWordsList;
