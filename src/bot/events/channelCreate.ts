import { GuildChannel, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const channelCreate: DiscordEvent = {
	name: "channelCreate",
	once: false,
	execute: async (newChannel: GuildChannel) => {
		const { guild } = newChannel;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		const embed = prepareEmbed(DiscordClient.getInstance().user as User)
			.setTitle("Valve thermostatique administrative")
			.setDescription(`Le salon ${newChannel.name} a été créé.`);

		if (channel && channel.isText()) {
			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = channelCreate;
