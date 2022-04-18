import { Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

const clearList: boolean[] = [];

const clear: DiscordCommand = {
	data: new SlashCommandBuilder().setName("clear").setDescription("Vide la playlist entièrement"),
	execute: async interaction => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel } = commandData;

		const people = Math.floor((channel.members.size / 100) * 51);
		clearList.push(true);

		if (clearList.length >= people || interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) {
			if (queue.skip()) {
				clearList.length = 0;

				return await macros.replyToInteraction(interaction, "👌 | Musique passée");
			}
		}

		return await macros.replyToInteraction(
			interaction,
			`👀 | ${people - clearList.length} personnes doivent encore`
		);
	}
};

module.exports = clear;
