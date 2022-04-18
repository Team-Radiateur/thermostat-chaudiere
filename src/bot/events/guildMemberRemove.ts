import { DiscordEvent } from "../types/discordEvents";
import { GuildMember } from "discord.js";
import { env } from "../../../config/env";

const guildMemberRemove: DiscordEvent = {
	name: "guildMemberRemove",
	once: false,
	execute: async (member: GuildMember) => {
		const { guild } = member;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannel);

		if (channel && channel.isText()) {
			await channel.send(`${member.user.username} a quitté le serveur.`);
		}
	}
};

module.exports = guildMemberRemove;
