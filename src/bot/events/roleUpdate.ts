import { Role, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const roleUpdate: DiscordEvent = {
	name: "roleUpdate",
	once: false,
	execute: async (role: Role) => {
		const { guild } = role;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User).setTitle(
				"Valve thermostatique administrative"
			);

			await channel.send({ embeds: [embed.setDescription(`Rôle "${role.name}" mis à jour.`)] });
		}
	}
};

module.exports = roleUpdate;
