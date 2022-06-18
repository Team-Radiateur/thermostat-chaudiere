import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

import { prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const skipList: boolean[] = [];

const skip: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Demande le changement direct de musique (si admin, passage direct)"),
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel, embed } = commandData;
		const people = Math.floor((channel.members.size / 100) * 51);

		skipList.push(true);

		if (skipList.length === people || interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) {
			while (!queue.skip()) {
				// Wait for the queue to skip the current track
			}

			skipList.length = 0;

			return await replyToInteraction(interaction, embed.setDescription("👌 | Musique passée"), false);
		}

		let response = `⏳ | ${people - skipList.length} personnes doivent encore voter pour passer cette musique.\n`;

		for (let iCharacter = 0; iCharacter < people; iCharacter++) {
			response += "█";
		}

		for (let iCharacter = 0; iCharacter < 100 - people; iCharacter++) {
			response += "░";
		}

		response += ` ${100 - people}% restants`;

		return await replyToInteraction(interaction, embed.setDescription(response));
	}
};

module.exports = skip;
