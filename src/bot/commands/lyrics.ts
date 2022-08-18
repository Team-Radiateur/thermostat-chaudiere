import { SlashCommandBuilder } from "@discordjs/builders";
import axios, { AxiosError } from "axios";
import { env } from "../../../config/env";
import { prepareResponseToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

interface LyricsRequestData {
	content: string;
	image: string;
}

interface LyricsRequestError {
	error: number;
	message: string;
}

const lyrics: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Trouve et affiche les paroles liées à la musique en cours de lecture ou à une chanson donnée")
		.addStringOption(option =>
			option.setName("musique").setDescription("La musique dont il faut trouver les paroles").setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);
		const music = interaction.options.get("musique")?.value;

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

		try {
			const { data } = await axios.get<LyricsRequestData>(
				`${env.external.lyricsApi.url}/${encodeURIComponent(music || songs[0].name)}`,
				{
					headers: {
						username: env.external.lyricsApi.username,
						password: env.external.lyricsApi.password
					}
				}
			);

			return await interaction.followUp({
				embeds: [
					embed
						.setDescription(`Paroles trouvées pour ${music || songs[0].name}:\n\n${data.content}`)
						.setImage(data.image)
				]
			});
		} catch (err) {
			const error = err as Error | AxiosError;

			if (axios.isAxiosError(error)) {
				if ((<AxiosError<LyricsRequestError>>error).response?.data?.error === 404) {
					return await interaction.followUp({
						embeds: [embed.setDescription("Aucun résultat trouvé pour cette musique")]
					});
				}
			}

			return await interaction.followUp({
				embeds: [embed.setDescription("Une erreur est survenue lors de la recherche des paroles")]
			});
		}
	}
};

module.exports = lyrics;
