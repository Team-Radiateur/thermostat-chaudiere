import { hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const showPlaylist: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Affiche les musiques qu'il reste encore à lire") as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue, embed } = commandData;
		embed
			.setTitle("Valve thermostatique musicale")
			.setDescription(
				queue.songs.length
					? "Voici la liste des musiques qu'il reste à lire :"
					: "Il n'y a pas de musiques dans la playlist"
			);

		queue.songs.forEach((song, index) => {
			if (index !== 0 && !song.name.includes("renarde.m4a")) {
				embed.addFields({
					name: `${index}. ${song.name} (${song.duration})`,
					value: hyperlink(song.url, song.url),
					inline: false
				});
			}
		});

		return await replyToInteraction(interaction, embed);
	}
};

module.exports = showPlaylist;
