import { roleMention } from "@discordjs/builders";
import { randomInt } from "crypto";
import { ChannelType, GuildMember } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberRemove: DiscordEvent = {
	name: "guildMemberRemove",
	once: false,
	execute: async (member: GuildMember) => {
		const { guild } = member;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(member.user).setTitle("Valve thermostatique des ressources humaines");
			let description = `${member.user.tag} a quitté le serveur.`;

			switch (randomInt(0, 100)) {
				case 0:
					description += " :smirk:";
					break;
				case 1:
					description += " :cry:";
					break;
				case 69:
					description += " À plus la connaissance d'ami.";
					break;
				case 99:
					description += " Nous penserons souvent à toi.";
					break;
				case 100:
					description += " Enfin un connard de moins.";
					break;
			}

			await channel.send({
				content: roleMention(env.bot.roleToTagOnUserRemove[guild.id]),
				embeds: [embed.setDescription(description)]
			});
		}
	}
};

module.exports = guildMemberRemove;
