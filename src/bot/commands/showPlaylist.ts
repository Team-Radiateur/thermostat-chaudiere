import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

const showPlaylist: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Affiche les musiques qu'il reste encore à lire") as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue } = commandData;

		let response = "🎵 | Voici la liste des prochains morceaux à jouer :\n";

		queue.songs.forEach((song, index) => {
			if (index !== 0 && !song.name.includes("renarde.m4a")) {
				response += `${index + 1}. ${song.name} (${song.url})`;
			}
		});

		return await macros.replyToInteraction(interaction, response);
	}
};

module.exports = showPlaylist;
