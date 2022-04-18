import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordCommand } from "../types/discordEvents";

const ping: DiscordCommand = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Répond avec Pong!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Pong!");
	}
};

module.exports = ping;
