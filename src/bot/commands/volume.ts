import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Affiche ou change le volume de la musique actuelle (admin/mod uniquement)")
		.addIntegerOption(
			(option) =>
				option
					.setName("nouveau")
					.setDescription("Le nouveau volume à mettre")
					.setMaxValue(1000)
					.setMinValue(0)
					.setRequired(false)
		),
	execute: async (interaction) => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue } = commandData;
		const newVolume = interaction.options.getInteger("nouveau");

		if (!newVolume) {
			return await macros.replyToInteraction(
				interaction,
				`🔊 | Volume actuel : ${queue.volume}%`
			);
		}

		if (queue.setVolume(newVolume)) {
			return await macros.replyToInteraction(
				interaction,
				`🔊 | Volume changé (nouveau volume: ${newVolume}`
			);
		}

		return await macros.replyToInteraction(
			interaction,
			`❌ | Volume non changé (nouveau volume: ${queue.volume}`
		);
	}
} as DiscordCommand;
