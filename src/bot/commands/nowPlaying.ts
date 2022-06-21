import { hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { Utils } from "discord-music-player";
import { splitBar } from "string-progressbar";

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
		const { nowPlaying } = queue;

		embed.setTitle("Valve thermostatique musicale");

		if (nowPlaying && !nowPlaying.name.includes("renarde.m4a")) {
			let description = `Vous écoutez actuellement ${hyperlink(nowPlaying.name, nowPlaying.url)}\n\n`;

			const size = 27;
			const currentTime = nowPlaying.seekTime + (queue.connection?.time || 0);
			const progress = Math.round((size * currentTime) / nowPlaying.milliseconds);

			description += splitBar(size, progress, size)[0];
			description += ` [${Utils.msToTime(currentTime)}/${nowPlaying.duration}]`;
			embed.setDescription(description);

			return await replyToInteraction(interaction, embed, false);
		}

		embed.setDescription("Il n'y a pas de musiques dans la playlist");

		return await replyToInteraction(interaction, embed, false);
	}
};

module.exports = nowPlaying;
