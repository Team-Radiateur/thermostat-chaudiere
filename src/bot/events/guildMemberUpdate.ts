import { hyperlink, roleMention } from "@discordjs/builders";
import { ChannelType, GuildMember } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberUpdate: DiscordEvent = {
	name: "guildMemberUpdate",
	once: false,
	execute: async (oldMember: GuildMember, newMember: GuildMember) => {
		const { guild } = newMember;
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(newMember.user)
				.setTitle("Valve thermostatique des ressources humaines")
				.setDescription(`${newMember.user.tag} a mis à jour des informations.`);

			if (oldMember.nickname !== newMember.nickname) {
				embed.addFields({
					name: "Surnom",
					value: `${oldMember.nickname} => ${newMember.nickname}`
				});
			}

			if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
				const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
				const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

				embed.addFields({
					name: "Rôles supprimés",
					value: removedRoles.map(role => `${role.name} (${roleMention(role.id)})`).join(", "),
					inline: false
				});
				embed.addFields({
					name: "Rôles ajoutés",
					value: addedRoles.map(role => `${role.name} (${roleMention(role.id)})`).join(", "),
					inline: false
				});
			}

			if (oldMember.user.username !== newMember.user.username) {
				embed.addFields({
					name: "Nom d'utilisateur",
					value: `${oldMember.user.username} => ${newMember.user.username}`,
					inline: false
				});
			}

			if (oldMember.user.discriminator !== newMember.user.discriminator) {
				embed.addFields({
					name: "Discriminant",
					value: `${oldMember.user.tag} => ${newMember.user.tag}`,
					inline: false
				});
			}

			if (oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
				embed.addFields({
					name: "Avatar",
					value: `${hyperlink("précédent", oldMember.user.avatarURL() || "")} => ${hyperlink(
						"nouveau",
						newMember.user.avatarURL() || ""
					)}`,
					inline: false
				});
			}

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = guildMemberUpdate;
