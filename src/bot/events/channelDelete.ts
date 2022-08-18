import { ChannelType, GuildChannel, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const channelDelete: DiscordEvent = {
	name: "channelDelete",
	once: false,
	execute: async (deletedChannel: GuildChannel) => {
		const { guild } = deletedChannel;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User)
				.setTitle("Valve thermostatique administrative")
				.setDescription(`Le salon ${deletedChannel.name} a été supprimé.`);

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = channelDelete;
