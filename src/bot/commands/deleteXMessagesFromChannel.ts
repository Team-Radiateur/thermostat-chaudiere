import { SlashCommandBuilder } from "@discordjs/builders";

import { CommandInteraction, Permissions, TextChannel } from "discord.js";
import { DiscordCommand } from "../types/discordEvents";
import { replyToInteraction } from "../../helpers/macros";

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
		if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return await replyToInteraction(interaction, "Eh, oh ! Tu t'es pris pour qui là, Marseillais ?");
		}

		const { channel } = interaction;

		if (!(channel instanceof TextChannel)) {
			return await replyToInteraction(
				interaction,
				"Faut envoyer le message dans un salon textuel de la guilde, débile !"
			);
		}

		const numberToDelete = interaction.options.getInteger("nombre");

		await channel.bulkDelete(numberToDelete as number, true);

		return await replyToInteraction(interaction, `Les ${numberToDelete} message(s) ont été supprimés chef`);
	}
};

module.exports = purgeMessages;
