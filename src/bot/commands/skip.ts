import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";
import { Permissions } from "discord.js";

const skipList: boolean[] = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Demande le changement direct de musique (si admin, passage direct)"),
	execute: async (interaction) => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel } = commandData;
		const people = Math.floor(channel.members.size / 100 * 51);
		skipList.push(true);

		if (
			skipList.length === people
			|| interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])
		) {
			if (queue.skip()) {
				skipList.length = 0;

				return await macros.replyToInteraction(
					interaction,
					"👌 | Musique passée"
				);
			}
		}

		return await macros.replyToInteraction(
			interaction,
			`👀 | ${people - skipList.length} personnes doivent encore voter pour passer cette musique`
		);
	}
} as DiscordCommand;
