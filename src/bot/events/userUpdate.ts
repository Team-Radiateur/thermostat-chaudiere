import { bold, hyperlink } from "@discordjs/builders";
import { ChannelType, TextChannel, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";

import { DiscordEvent } from "../types/discordEvents";

const userUpdate: DiscordEvent = {
	name: "userUpdate",
	once: false,
	execute: async (oldUser: User, newUser: User) => {
		if (oldUser.bot) return;

		const loggingChannels: TextChannel[] = [];

		Object.keys(env.bot.userUpdateLoggingChannelByGuild).forEach(guildId => {
			const guild = DiscordClient.getInstance().guilds.cache.get(guildId);

			if (guild && guild.members.cache.has(newUser.id)) {
				const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guildId]);

				if (channel && channel.type === ChannelType.GuildText) {
					loggingChannels.push(channel as TextChannel);
				}
			}
		});

		if (loggingChannels.every(channel => !channel)) return;
		const embed = prepareEmbed(oldUser)
			.setTitle("Valve thermostatique événementielle")
			.setDescription(bold(`${oldUser.tag} a mis à jour son profil !`))
			.setFooter({ text: `ID de l'utilisateur: ${newUser.id}` });

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			embed.addFields({
				name: "Avatar",
				value: `${hyperlink("[précédent]", oldUser.displayAvatarURL())} => ${hyperlink(
					"[nouveau]",
					newUser.displayAvatarURL()
				)}`
			});
		} else if (oldUser.username !== newUser.username) {
			embed.addFields({
				name: "Nouveau pseudo",
				value: `${oldUser.username} => ${newUser.username}`
			});
		} else if (oldUser.discriminator !== newUser.discriminator) {
			embed.addFields({
				name: "Nouveau discriminant",
				value: `${oldUser.discriminator} => ${newUser.discriminator}`
			});
		} else if (oldUser.tag !== newUser.tag) {
			embed.addFields({ name: "Nouveau tag", value: newUser.tag });
		} else {
			return;
		}

		await Promise.all(loggingChannels.map(loggingChannel => loggingChannel.send({ embeds: [embed] })));
	}
};

module.exports = userUpdate;
