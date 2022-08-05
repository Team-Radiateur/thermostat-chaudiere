import { GuildMember } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberRemove: DiscordEvent = {
	name: "guildMemberRemove",
	once: false,
	execute: async (member: GuildMember) => {
		const { guild } = member;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(member.user).setTitle("Valve thermostatique des ressources humaines");

			await channel.send({ embeds: [embed.setDescription(`${member.user.tag} a quitté le serveur.`)] });
		}
	}
};

module.exports = guildMemberRemove;
