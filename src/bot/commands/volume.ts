import { SlashCommandBuilder } from "@discordjs/builders";
import { prepareEmbed, prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

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
		const newVolume = interaction.options.get("nouveau")?.value;
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique musicale");

		if (!newVolume) {
			return await replyToInteraction(
				interaction,
				embed.setDescription(`🔉 | Le volume actuel est de ${queue.node.volume}%`)
			);
		}

		if (queue.node.setVolume(newVolume as number)) {
			return await replyToInteraction(
				interaction,
				embed.setDescription(`🔉 | Le volume a été mis à ${newVolume}%`)
			);
		}

		return await replyToInteraction(
			interaction,
			embed.setDescription(`❌ | Volume non changé (volume actuel : ${queue.node.volume}`)
		);
	}
};

module.exports = volume;
