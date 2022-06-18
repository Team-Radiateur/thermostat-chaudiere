import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { prepareEmbed, prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

const volume: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Affiche ou change le volume de la musique actuelle (admin/mod uniquement)")
		.addIntegerOption(option =>
			option
				.setName("nouveau")
				.setDescription("Le nouveau volume à mettre")
				.setMaxValue(1000)
				.setMinValue(0)
				.setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const { queue } = commandData;
		const newVolume = interaction.options.getInteger("nouveau");
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique musicale");

		if (!newVolume) {
			return await replyToInteraction(
				interaction,
				embed.setDescription(`🔉 | Le volume actuel est de ${queue.volume}%`)
			);
		}

		if (queue.setVolume(newVolume)) {
			return await replyToInteraction(
				interaction,
				embed.setDescription(`🔉 | Le volume a été mis à ${newVolume}%`)
			);
		}

		return await replyToInteraction(
			interaction,
			embed.setDescription(`❌ | Volume non changé (volume souhaité : ${queue.volume}`)
		);
	}
};

module.exports = volume;
