import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordCommand } from "../types/discordEvents";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Répond avec Pong!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Pong!");
	},
} as DiscordCommand;
