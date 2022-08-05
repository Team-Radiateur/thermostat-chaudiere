import { GuildBan, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildBanAdd: DiscordEvent = {
	name: "guildBanAdd",
	once: false,
	execute: async (ban: GuildBan) => {
		const { guild } = ban;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User)
				.setTitle("Valve thermostatique administrative")
				.setDescription(`${ban.user.tag} a été banni du serveur.`);

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = guildBanAdd;
