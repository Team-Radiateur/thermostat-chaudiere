import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordCommand } from "../types/discordEvents";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

const ping: DiscordCommand = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Répond avec Pong!"),
	async execute(interaction: CommandInteraction) {
		await replyToInteraction(
			interaction,
			prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle").setDescription("Pong!")
		);
	}
};

module.exports = ping;
