import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { macros } from "../../helpers/macros";

const pause: DiscordCommand = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Met la lecture en pause"),
	execute: async interaction => {
		const commandData = await macros.checkCommand(interaction);

		if (!commandData) {
			return;
		}

		const { queue } = commandData;

		if (!queue.isPlaying) {
			return;
		}

		queue.setPaused(true);

		return await macros.replyToInteraction(interaction, "⏸ | La lecture est en pause");
	}
};

module.exports = pause;
