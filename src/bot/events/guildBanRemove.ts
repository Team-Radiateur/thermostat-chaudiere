import { roleMention, userMention } from "@discordjs/builders";
import { ChannelType, GuildBan } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildBanRemove: DiscordEvent = {
	name: "guildBanRemove",
	once: false,
	execute: async (ban: GuildBan) => {
		const { guild } = ban;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(ban.user).setTitle("Valve thermostatique administrative");

			await channel.send({
				content: roleMention(env.bot.roleToTagOnUserRemove[guild.id]),
				embeds: [embed.setDescription(`Suppression du bannissement de ${userMention(ban.user.id)}`)]
			});
		}
	}
};

module.exports = guildBanRemove;
