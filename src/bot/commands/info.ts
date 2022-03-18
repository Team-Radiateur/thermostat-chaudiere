import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Affiche les informations du serveur"),
	execute: async (interaction) => {
		const temperature = Math.floor(Math.random() * 70 + 21);
		const connectedPeople = interaction.guild?.members.cache.filter(
			member => member.presence?.status === "online"
		);
		let message = `Nombre de personnes sur le serveur : ${interaction.guild?.memberCount}\n`;

		message += `Nombre de personnes actuellement connectées : ${connectedPeople?.size}\n`;
		message += `Température de la Chaudière : ${temperature}°C\n\n`;


		await interaction.reply(message);
	}
} as DiscordCommand;
