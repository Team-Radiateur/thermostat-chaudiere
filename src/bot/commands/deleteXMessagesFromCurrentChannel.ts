import { SlashCommandBuilder } from "@discordjs/builders";

import { CommandInteraction, Permissions, TextChannel } from "discord.js";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { DiscordCommand } from "../types/discordEvents";

const purgeMessages: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("purge_messages")
		.setDescription("Supprime les x derniers messages envoyés dans le salon")
		.addIntegerOption(option =>
			option
				.setName("nombre")
				.setDescription("Le nombre de messages à supprimer")
				.setMinValue(1)
				.setRequired(false)
		)
		.addMentionableOption(option =>
			option
				.setName("personne")
				.setDescription("La personne dont il faut supprimer les messages")
				.setRequired(false)
		) as SlashCommandBuilder,
	execute: async (interaction: CommandInteraction) => {
		const embed = prepareEmbed(interaction.user);

		if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
			embed
				.setTitle("Valve thermostatique générale")
				.setDescription("Eh, oh ! Tu t'es pris pour qui là, Marseillais ?");

			return await replyToInteraction(interaction, embed);
		}

		const { channel } = interaction;

		if (!(channel instanceof TextChannel)) {
			return await replyToInteraction(
				interaction,
				embed
					.setTitle("Valve thermostatique générale")
					.setDescription("Faut envoyer le message dans un salon textuel de la guilde, débile !")
			);
		}

		const numberToDelete = interaction.options.getInteger("nombre");
		const user = interaction.options.getMentionable("personne");

		// prettier-ignore
		await channel.bulkDelete(
			user
				? (await channel.awaitMessages())
					.filter(item => item.member === user)
					.toJSON()
					.filter((_, index) => (numberToDelete !== null ? index < numberToDelete : true))
				: (numberToDelete as number),
			true
		);

		return await replyToInteraction(
			interaction,
			embed
				.setTitle("Valve thermostatique textuelle")
				.setDescription(`Les ${numberToDelete} message(s) ont été supprimés, chef`)
		);
	}
};

module.exports = purgeMessages;
