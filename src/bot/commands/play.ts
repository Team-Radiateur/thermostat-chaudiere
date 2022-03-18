import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordCommand } from "../types/discordEvents";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Ajoute une chanson à la liste de lecture"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Pas implémenté pour le moment");
	},
} as DiscordCommand;
