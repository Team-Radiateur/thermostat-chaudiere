import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";
import { prepareEmbed, prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const clearList: boolean[] = [];

const clear: DiscordCommand = {
	data: new SlashCommandBuilder().setName("clear").setDescription("Vide la playlist entièrement"),
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue, channel } = commandData;

		const people = Math.floor((channel.members.size / 100) * 51);
		clearList.push(true);

		if (
			clearList.length >= people ||
			interaction.memberPermissions?.has([PermissionsBitField.Flags.Administrator])
		) {
			if (queue.skip()) {
				clearList.length = 0;
				const embed = prepareEmbed(interaction.user)
					.setTitle("Valve thermostatique musicale")
					.setDescription("👍 | La musique a été passée !");

				return await replyToInteraction(interaction, embed);
			}
		}

		const embed = prepareEmbed(interaction.user)
			.setTitle("Valve thermostatique musicale")
			.setDescription(`👀 | ${people - clearList.length} personnes doivent encore voter pour passer la musique`);

		return await replyToInteraction(interaction, embed);
	}
};

module.exports = clear;
