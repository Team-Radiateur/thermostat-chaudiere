import { SlashCommandBuilder } from "@discordjs/builders";

import { DiscordCommand } from "../types/discordEvents";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

const info: DiscordCommand = {
	data: new SlashCommandBuilder().setName("info").setDescription("Affiche les informations du serveur"),
	execute: async interaction => {
		const temperature = Math.floor(Math.random() * 70 + 21);
		const connectedPeople = interaction.guild?.members.cache.filter(member => member.presence?.status === "online");
		const embed = prepareEmbed(interaction.user)
			.setTitle("Valve thermostatique générale")
			.setDescription("Voici les informations du serveur :")
			.addField("🌡 | Température", `${temperature}°C`)
			.addField("👥 | Nombre de personnes sur le serveur :", `${interaction.guild?.memberCount} personnes`)
			.addField("🔋 | Nombre de personnes connectées", `${connectedPeople?.size ?? 0} personnes`);

		return await replyToInteraction(interaction, embed);
	}
};

module.exports = info;
