import { Interaction } from "discord.js";

import { logger } from "../../helpers/logger";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const interactionCreate: DiscordEvent = {
	name: "interactionCreate",
	once: false,
	execute: async (interaction: Interaction) => {
		if (interaction.user.bot) return;

		if (!interaction.isChatInputCommand()) return;

		try {
			// eslint-disable-next-line max-len
			logger.info(
				`${interaction.user.username}#${
					interaction.user.discriminator
				} a appelé la fonction ${interaction.toString()}`
			);

			const command = DiscordClient.commands.get(interaction.commandName);

			if (!command) return;

			await command.execute(interaction);
		} catch (error) {
			logger.error((error as Error).stack as string);
			if (!(await interaction.fetchReply())) {
				const embed = prepareEmbed(interaction.user);

				embed.setTitle("Valve thermostatique générale");
				embed.setDescription("Désolé, une erreur est survenue lors de l'exécution de la commande.");

				await replyToInteraction(interaction, embed);
			}
		}
	}
};

module.exports = interactionCreate;
