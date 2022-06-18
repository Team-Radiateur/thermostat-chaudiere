import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { prepareEmbed, prepareResponseToInteraction, replyToInteraction } from "../../helpers/macros";

const pause: DiscordCommand = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Met la lecture en pause"),
	execute: async interaction => {
		const commandData = await prepareResponseToInteraction(interaction);

		if (!commandData) {
			return;
		}

		const embed = prepareEmbed(interaction.user);

		const { queue } = commandData;

		if (!queue.isPlaying) {
			embed.setTitle("Valve thermostatique musicale").setDescription("❌ | Pas de musique en cours de lecture");

			return await replyToInteraction(interaction, embed, true);
		}

		queue.setPaused(true);

		return await replyToInteraction(interaction, "⏸ | La lecture est en pause");
	}
};

module.exports = pause;
