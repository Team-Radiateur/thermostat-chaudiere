import { SlashCommandBuilder } from "@discordjs/builders";
import { prepareResponseToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";
import GeniusClient from "../types/geniusClient";

const lyrics: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Trouve et affiche les paroles liées à la musique en cours de lecture ou à une chanson donnée")
		.addStringOption(option =>
			option.setName("musique").setDescription("La musique dont il faut trouver les paroles").setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);
		const music = interaction.options.getString("musique");

		if (!commandData) {
			return;
		}

		const { queue, embed } = commandData;

		if (!interaction.guild) {
			return await interaction.reply({
				embeds: [embed.setDescription("Cette commande n'est pas disponible en MP")]
			});
		}

		const { songs } = queue;
		if (!music && (!songs || !songs.length)) {
			return await interaction.reply({
				embeds: [embed.setDescription("Il n'y a pas de musique en cours de lecture")]
			});
		}

		await interaction.deferReply();

		const geniusClient = GeniusClient.getInstance();
		const found = await geniusClient.songs.search(music || songs[0].name);

		if (!found || !found.length) {
			return await interaction.followUp({
				embeds: [embed.setDescription("Aucun résultat trouvé pour cette musique")]
			});
		}

		const lyrics = await found[0].lyrics();

		return await interaction.followUp({
			embeds: [
				embed
					.setDescription(`Paroles trouvées pour ${music || songs[0].name}:\n\n${lyrics}`)
					.setImage(found[0].image)
			]
		});
	}
};

module.exports = lyrics;
