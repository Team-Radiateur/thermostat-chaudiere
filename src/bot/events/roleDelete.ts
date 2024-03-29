import { roleMention } from "@discordjs/builders";
import { ChannelType, Role, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const roleDelete: DiscordEvent = {
	name: "roleDelete",
	once: false,
	execute: async (role: Role) => {
		const { guild } = role;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User).setTitle(
				"Valve thermostatique administrative"
			);

			await channel.send({
				content: roleMention(env.bot.roleToTagOnUserRemove[guild.id]),
				embeds: [embed.setDescription(`Rôle "${role.name}" supprimé.`)]
			});
		}
	}
};

module.exports = roleDelete;
