import { SlashCommandBuilder } from "@discordjs/builders";

import { CommandInteraction, Permissions, TextChannel } from "discord.js";
import { DiscordCommand } from "../types/discordEvents";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

const purgeMessages: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("purge_messages")
		.setDescription("Supprime les x derniers messages envoyés dans le salon")
		.addIntegerOption(option =>
			option
				.setName("nombre")
				.setDescription("Le nombre de messages à supprimer")
				.setMinValue(1)
				.setRequired(true)
		) as SlashCommandBuilder,
	execute: async (interaction: CommandInteraction) => {
		const embed = prepareEmbed(interaction.user);

		if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
			embed
				.setTitle("Valve thermostatique textuelle")
				.setDescription("Eh, oh ! Tu t'es pris pour qui là, Marseillais ?");

			return await replyToInteraction(interaction, embed);
		}

		const { channel } = interaction;

		if (!(channel instanceof TextChannel)) {
			embed
				.setTitle("Valve thermostatique générale")
				.setDescription("Faut envoyer le message dans un salon textuel de la guilde, débile !");

			return await replyToInteraction(interaction, embed);
		}

		const numberToDelete = interaction.options.getInteger("nombre");

		await channel.bulkDelete(numberToDelete as number, true);

		embed
			.setTitle("Valve thermostatique textuelle")
			.setDescription(`Les ${numberToDelete} message(s) ont été supprimés, chef`);

		return await replyToInteraction(interaction, embed);
	}
};

module.exports = purgeMessages;
