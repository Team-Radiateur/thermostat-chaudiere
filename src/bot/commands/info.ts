import { SlashCommandBuilder } from "@discordjs/builders";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const info: DiscordCommand = {
	data: new SlashCommandBuilder().setName("info").setDescription("Affiche les informations du serveur"),
	execute: async interaction => {
		const temperature = Math.floor(Math.random() * 70 + 21);
		const connectedPeople = interaction.guild?.members.cache.filter(member => member.presence?.status === "online");
		const embed = prepareEmbed(interaction.user)
			.setTitle("Valve thermostatique générale")
			.setDescription("Voici les informations du serveur :")
			.addFields([
				{
					name: "🌡 | Température",
					value: `${temperature}°C`
				},
				{
					name: "👥 | Nombre de personnes sur le serveur :",
					value: `${interaction.guild?.memberCount} personnes`
				},
				{
					name: "🔋 | Nombre de personnes connectées",
					value: `${connectedPeople?.size ?? 0} personnes`
				}
			]);

		return await replyToInteraction(interaction, embed);
	}
};

module.exports = info;
