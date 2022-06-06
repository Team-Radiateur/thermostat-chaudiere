import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

const play: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Lance la lecture ou ajoute une chanson à la liste")
		.addStringOption(option =>
			option.setName("musique").setDescription("La musique à jouer").setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel } = commandData;

		const uri = interaction.options.getString("musique");

		if (!uri) {
			if (!queue.songs.length) {
				return await macros.replyToInteraction(
					interaction,
					"❌ | Il n'y a aucune musique à lire dans la playlist."
				);
			}

			if (!queue.isPlaying) {
				return await macros.replyToInteraction(
					interaction,
					"❌ | Aucune musique n'est en cours de lecture actuellement."
				);
			}

			queue.setPaused(false);
			return await macros.replyToInteraction(interaction, "▶️ | Reprise de la lecture...");
		} else {
			try {
				await queue.join(channel);
			} catch (error) {
				return await macros.replyToInteraction(interaction, "😬 | Je n'ai pas su me connecter au canal", true);
			}

			await interaction.deferReply();

			const song = await queue.play(uri);
			if (!song) {
				return await interaction.followUp({
					content: `❌ | Le morceau **${uri}** n'a pas été trouvé !`
				});
			}

			let response = `👌 | Morceau **${song.name}** ajouté à la liste de lecture`;

			if (queue.songs.length - 1 > 0) {
				response += "\nListe des prochaines musiques :\n";

				queue.songs.forEach((song, index) => {
					if (index !== 0 && !song.name.includes("renarde.m4a")) {
						response += `${index}. ${song.name} (${song.url})\n`;
					}
				});
			}

			return await interaction.followUp({
				content: response
			});
		}
	}
};

module.exports = play;
