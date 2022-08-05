import { userMention } from "@discordjs/builders";
import { GuildMember, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberAdd: DiscordEvent = {
	name: "guildMemberAdd",
	once: false,
	execute: async (member: GuildMember) => {
		const { guild } = member;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User).setTitle(
				"Valve thermostatique des ressources humaines"
			);

			embed.setDescription(`Arrivée sur le serveur de ${userMention(member.id)}`);

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = guildMemberAdd;
