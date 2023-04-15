import { hyperlink, SlashCommandBuilder } from "@discordjs/builders";

import { prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const nowPlaying: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("now_playing")
		.setDescription("Affiche les informations de la musique en cours de lecture") as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue, embed } = commandData;
		const { currentTrack: nowPlaying } = queue;

		embed.setTitle("Valve thermostatique musicale");

		if (nowPlaying && !nowPlaying.title.includes("renarde.m4a")) {
			let description = `Vous écoutez actuellement ${hyperlink(nowPlaying.title, nowPlaying.url)}\n\n`;

			description += queue.node.createProgressBar({ timecodes: true, length: 27 });
			embed.setDescription(description);

			return await replyToInteraction(interaction, embed, false);
		}

		embed.setDescription("Il n'y a pas de musiques dans la playlist");

		return await replyToInteraction(interaction, embed, false);
	}
};

module.exports = nowPlaying;
