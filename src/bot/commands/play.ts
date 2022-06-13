import { hyperlink, SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

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
		const uri = interaction.options.getString("musique");

		embed.setTitle("Playlist");

		if (!uri) {
			if (!queue.songs.length) {
				embed.setDescription("❌ | Il n'y a aucune musique à lire dans la playlist.");

				return await replyToInteraction(interaction, embed);
			}

			if (!queue.isPlaying) {
				embed.setDescription("❌ | Aucune musique n'est en cours de lecture actuellement.");

				return await replyToInteraction(interaction, embed);
			}

			queue.setPaused(false);
			embed.setDescription("▶️ | Reprise de la lecture...");
			return await replyToInteraction(interaction, embed);
		} else {
			try {
				await queue.join(channel);
			} catch (error) {
				console.log(error);
				embed.setDescription("😬 | Impossible de rejoindre le salon.");
				return await replyToInteraction(interaction, embed, true);
			}

			await interaction.deferReply();

			let song;
			try {
				song = await queue.play(uri);
			} catch (error) {
				return await interaction.reply({
					content: `❌ | Le morceau **${uri}** n'a pas été trouvé !`
				});
			}

			embed.setTitle(song.name);
			const response = `Ajouté à la liste de lecture`;

			if (queue.songs.length - 1 > 0) {
				queue.songs.forEach((song, index) => {
					if (index !== 0 && !song.name.includes("renarde.m4a")) {
						embed.addField(
							`${hyperlink(String(index), song.url)}. ${song.name} (${song.duration})`,
							hyperlink("lien", song.url)
						);
					}
				});
			}

			embed.setDescription(response);
			embed.setThumbnail(song.thumbnail);
			return await interaction.followUp({ embeds: [embed], ephemeral: true });
		}
	}
};

module.exports = play;
