import { ButtonInteraction, EmbedBuilder, GuildMember, RoleResolvable } from "discord.js";
import { logger } from "../../helpers/logger";
import { DiscordEvent } from "../types/discordEvents";

const roleAdd: DiscordEvent = {
	name: "roleAdd",
	once: false,
	execute: async (role: RoleResolvable, member: GuildMember, interaction?: ButtonInteraction) => {
		logger.info(`Rôle ${role} donné à ${member.displayName}`);

		if (interaction) {
			const embed = new EmbedBuilder()
				.setTitle("Valve thermostatique administrative")
				.setDescription(`Ajout du rôle ${role} à votre compte effectué`);

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

module.exports = roleAdd;
