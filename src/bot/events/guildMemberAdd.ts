import { ChannelType, GuildMember, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberAdd: DiscordEvent = {
	name: "guildMemberAdd",
	once: false,
	execute: async (member: GuildMember) => {
		const { guild } = member;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User)
				.setTitle("Valve thermostatique des ressources humaines")
				.setDescription(`Arrivée sur le serveur de ${member.user.tag}`);

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = guildMemberAdd;
