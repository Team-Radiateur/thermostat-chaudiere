import { userMention } from "@discordjs/builders";
import { GuildBan } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordEvent } from "../types/discordEvents";

const guildBanRemove: DiscordEvent = {
	name: "guildBanRemove",
	once: false,
	execute: async (ban: GuildBan) => {
		const { guild } = ban;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(ban.user).setTitle("Valve thermostatique administrative");

			await channel.send({
				embeds: [embed.setDescription(`Suppression du bannissement de ${userMention(ban.user.id)}`)]
			});
		}
	}
};

module.exports = guildBanRemove;
