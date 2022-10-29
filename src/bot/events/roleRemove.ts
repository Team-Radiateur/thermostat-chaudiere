import { ButtonInteraction, EmbedBuilder, GuildMember, RoleResolvable } from "discord.js";
import { logger } from "../../helpers/logger";
import { DiscordEvent } from "../types/discordEvents";

const roleRemove: DiscordEvent = {
	name: "roleRemove",
	once: false,
	execute: async (role: RoleResolvable, member: GuildMember, interaction?: ButtonInteraction) => {
		logger.info(`Rôle ${role} retiré de ${member.displayName}`);

		if (interaction) {
			const embed = new EmbedBuilder()
				.setTitle("Valve thermostatique administrative")
				.setDescription(`Retrait du rôle ${role} de votre compte effectué`);

			if (interaction.replied) {
				await interaction.editReply({
					embeds: [embed]
				});
			} else {
				await interaction.reply({
					embeds: [embed]
				});
			}
		}
	}
};

module.exports = roleRemove;
