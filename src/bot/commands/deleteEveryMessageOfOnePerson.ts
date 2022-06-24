import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import { Guild, GuildMember, Permissions, TextChannel } from "discord.js";
import { logger } from "../../helpers/logger";

import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const deleteEveryMessageOfOnePerson: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("supprimer_tout_de")
		.setDescription("Supprime tous les messages de la personne mentionnée dans les 15 derniers jours")
		.addMentionableOption(option =>
			option
				.setName("personne")
				.setDescription("La personne dont il faut supprimer les messages")
				.setRequired(true)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique administrative");
		const { guild } = interaction;

		if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
			embed
				.setTitle("Valve thermostatique générale")
				.setDescription("Eh, oh ! Tu t'es pris pour qui là, Marseillais ?");

			return await replyToInteraction(interaction, embed);
		}

		const user = interaction.options.getMentionable("personne");

		if (!user || !(user instanceof GuildMember)) {
			logger.error("Erreur de récupération de l'utilisateur");

			return await replyToInteraction(
				interaction,
				embed.setDescription("Une erreur est survenue lors de la récupération de l'utilisateur")
			);
		}

		await interaction.deferReply();

		for (const channel of (guild as Guild).channels
			.valueOf()
			.filter(channel => channel instanceof TextChannel)
			.values()) {
			assert(channel instanceof TextChannel, "channel is not a TextChannel, which is unexpected");

			// prettier-ignore
			await channel.bulkDelete(
				(await channel.messages.fetch({ before: interaction.id })).filter(
					item => item.author.id === user.id
				),
				true
			);
		}

		return await interaction.followUp({
			embeds: [embed.setDescription(`Les messages envoyés les 15 derniers jours par ${user} ont été supprimés`)]
		});
	}
};

module.exports = deleteEveryMessageOfOnePerson;
