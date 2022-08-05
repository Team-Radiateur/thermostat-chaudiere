import { hyperlink, roleMention } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordEvent } from "../types/discordEvents";

const guildMemberUpdate: DiscordEvent = {
	name: "guildMemberUpdate",
	once: false,
	execute: async (oldMember: GuildMember, newMember: GuildMember) => {
		const { guild } = newMember;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(newMember.user)
				.setTitle("Valve thermostatique des ressources humaines")
				.setDescription(`${newMember.user.tag} a mis a jour des informations.`);

			if (oldMember.nickname !== newMember.nickname) {
				embed.addField("Surnom", `${oldMember.nickname} => ${newMember.nickname}`);
			}

			if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
				const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
				const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

				embed.addField(
					"Rôles supprimés",
					removedRoles.map(role => `${role.name} (${roleMention(role.id)})`).join("\n")
				);
				embed.addField(
					"Rôles ajoutés",
					addedRoles.map(role => `${role.name} (${roleMention(role.id)})`).join("\n")
				);
			}

			if (oldMember.user.username !== newMember.user.username) {
				embed.addField("Nom d'utilisateur", `${oldMember.user.username} => ${newMember.user.username}`);
			}

			if (oldMember.user.discriminator !== newMember.user.discriminator) {
				embed.addField("Discriminant", `${oldMember.user.tag} => ${newMember.user.tag}`);
			}

			if (oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
				embed.addField(
					"Avatar",
					`${hyperlink("précédent", oldMember.user.avatarURL() || "")} => ${hyperlink(
						"nouveau",
						newMember.user.avatarURL() || ""
					)}`
				);
			}

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = guildMemberUpdate;
