import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Affiche les musiques qu'il reste encore à lire"),
	execute: async (interaction) => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue } = commandData;

		let response = "🎵 | Voici la liste des prochains morceaux à jouer :\n";

		queue.tracks.forEach((track, index) => {
			response += `${index + 1}. ${track.title} (${track.url})`;
		});

		return await macros.replyToInteraction(
			interaction,
			response
		);
	}
} as DiscordCommand;
