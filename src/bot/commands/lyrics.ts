import { SlashCommandBuilder } from "@discordjs/builders";
import { prepareResponseToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";
import GeniusClient from "../types/geniusClient";

const lyrics: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Trouve et affiche les paroles liées à la musique en cours de lecture") as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

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
		if (!songs || !songs.length) {
			return await interaction.reply({
				embeds: [embed.setDescription("Il n'y a pas de musiques dans la playlist")]
			});
		}

		const [song] = songs;
		const geniusClient = GeniusClient.getInstance();
		const found = await geniusClient.songs.search(song.name);

		if (!found || !found.length) {
			return await interaction.reply({
				embeds: [embed.setDescription("Aucun résultat trouvé pour cette musique")]
			});
		}

		return await interaction.reply({
			embeds: [
				embed.setDescription(`Paroles trouvées pour ${song.name}:\n${found[0].lyrics}`).setImage(found[0].image)
			]
		});
	}
};

module.exports = lyrics;
