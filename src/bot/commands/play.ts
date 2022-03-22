import { VoiceChannel } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Lance la lecture ou ajoute une chanson à la liste")
		.addStringOption(
			(option) =>
				option
					.setName("musique")
					.setDescription("La musique à jouer")
					.setRequired(false)
		),
	execute: async (interaction) => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel } = commandData;

		const uri = interaction.options.getString("musique");

		if (!uri) {
			if (queue.tracks.length) {
				return await macros.replyToInteraction(
					interaction,
					"❌ | Il n'y a aucune musique à lire dans la playlist."
				);
			}

			if (!queue.nowPlaying()) {
				return await macros.replyToInteraction(
					interaction,
					"❌ | Aucune musique n'est en cours de lecture actuellement."
				);
			}

			queue.setPaused(false);
			return await macros.replyToInteraction(
				interaction,
				"▶️ | Reprise de la lecture..."
			);
		} else {
			try {
				if (!queue.connection) {
					await queue.connect(channel as VoiceChannel);
				}
			} catch (error) {
				queue.destroy();

				return await macros.replyToInteraction(
					interaction,
					"😬 | Je n'ai pas su me connecter au canal",
					true
				);
			}

			await interaction.deferReply();
			const track = await queue.player.search(uri, {
				requestedBy: interaction.user
			}).then(x => x.tracks[0]);
			if (!track) {
				return await interaction.followUp(
					{
						content: `❌ | Le morceau **${uri}** n'a pas été trouvé !`
					}
				);
			}

			await queue.addTrack(track);

			if (!queue.playing) {
				await queue.play();

				return await interaction.followUp(
					{
						content: `⏱️ | Lecture du morceau **${track.title}** !`
					}
				);
			}

			return await interaction.followUp(
				{
					content: `👌 | Morceau ajouté à la liste de lecture`
				}
			);
		}
	}
} as DiscordCommand;
