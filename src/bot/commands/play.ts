import { bold, hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { Song } from "discord-music-player";
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
			if (!queue.songs.length) {
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

			queue.setPaused(false);
			return await replyToInteraction(interaction, embed.setDescription("▶️ | Reprise de la lecture..."));
		} else {
			try {
				await queue.join(channel);
			} catch (error) {
				logger.error(`Une erreur est survenue lors de la connexion au canal:\n${(<Error>error).message}`);

				return await replyToInteraction(
					interaction,
					embed.setDescription("😬 | Impossible de rejoindre le salon."),
					true
				);
			}

			await interaction.deferReply();

			let songOrPlaylist;

			try {
				const uriValue = uri.value as string;

				songOrPlaylist = !uriValue.includes("list=")
					? await queue.play(uriValue)
					: await queue.playlist(uriValue);
			} catch (error) {
				logger.error(
					`Une erreur est survenue lors du chargement d'une musique/playlist:\n${(<Error>error).message}`
				);

				return await interaction.followUp({
					content: `❌ | Le morceau **${uri.value}** n'a pas été trouvé !`
				});
			}

			embed.setTitle("Valve thermostatique musicale");

			let description;

			if (songOrPlaylist instanceof Song) {
				description = `${hyperlink(songOrPlaylist.name, songOrPlaylist.url)} ajouté à la liste de lecture.`;
				embed.setThumbnail(songOrPlaylist.thumbnail);
			} else {
				description = `Playlist **${songOrPlaylist.name}** ajoutée à la liste de lecture.`;
				embed.setThumbnail(songOrPlaylist.songs[0].thumbnail);
			}

			if (queue.songs.length - 1 > 0) {
				description += `\n\n${bold("Playlist :")}`;

				embed.addFields(
					queue.songs
						.filter((song, index) => index !== 0 && index < 25 && !song.name.includes("renarde.mp4"))
						.map((song, index) => {
							return {
								name: `${index}. ${song.name} (${song.duration})`,
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
