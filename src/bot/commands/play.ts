import { bold, hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { logger } from "../../helpers/logger";
import { prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const play: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Lance la lecture ou ajoute une chanson à la liste")
		.addStringOption(option =>
			option.setName("musique").setDescription("La musique à jouer").setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel, embed } = commandData;
		const uri = interaction.options.get("musique");

		if (!uri) {
			const { tracks } = queue;
			const songs = tracks.toArray();

			if (!songs.length) {
				return await replyToInteraction(
					interaction,
					embed.setDescription("❌ | Il n'y a aucune musique à lire dans la playlist.")
				);
			}

			if (!queue.isPlaying) {
				return await replyToInteraction(
					interaction,
					embed.setDescription("❌ | Aucune musique n'est en cours de lecture actuellement.")
				);
			}

			queue.node.setPaused(false);
			return await replyToInteraction(interaction, embed.setDescription("▶️ | Reprise de la lecture..."));
		} else {
			await interaction.deferReply();

			let description;

			try {
				const { track } = await queue.player.play(channel, uri.value as string);

				description = `${hyperlink(track.title, track.url)} ajouté à la liste de lecture.`;
				embed.setThumbnail(track.thumbnail);
			} catch (error) {
				logger.error(`Une erreur est survenue lors de la connexion au canal:\n${(<Error>error).message}`);

				return await interaction.followUp({
					embeds: [embed.setDescription("😬 | Une erreur est survenue lors de la recherche de la chanson.")],
					ephemeral: true
				});
			}

			embed.setTitle("Valve thermostatique musicale");

			const { tracks } = queue;
			const songs = tracks.toArray();

			if (songs.length - 1 > 0) {
				description += `\n\n${bold("Playlist :")}`;

				embed.addFields(
					songs
						.filter((song, index) => index !== 0 && index < 25 && !song.title.includes("renarde.mp4"))
						.map((song, index) => {
							return {
								name: `${index}. ${song.title} (${song.duration})`,
								value: hyperlink(song.url, song.url),
								inline: false
							};
						})
				);
			}

			embed.setDescription(description);

			return await interaction.followUp({ embeds: [embed], ephemeral: true });
		}
	}
};

module.exports = play;
