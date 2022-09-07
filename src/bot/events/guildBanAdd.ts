import { roleMention } from "@discordjs/builders";
import { ChannelType, GuildBan, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildBanAdd: DiscordEvent = {
	name: "guildBanAdd",
	once: false,
	execute: async (ban: GuildBan) => {
		const { guild } = ban;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User)
				.setTitle("Valve thermostatique administrative")
				.setDescription(`${ban.user.tag} a été banni du serveur.`);

			await channel.send({
				content: roleMention(env.bot.roleToTagOnUserRemove[guild.id]),
				embeds: [embed]
			});
		}
	}
};

module.exports = guildBanAdd;
