import { channelMention } from "@discordjs/builders";
import { GuildChannel, User } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";

import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const getType = (type: Exclude<keyof typeof ChannelTypes, "DM" | "GROUP_DM" | "UNKNOWN">) => {
	switch (type) {
		case "GUILD_TEXT":
			return "Texte";
		case "GUILD_VOICE":
			return "Vocal";
		case "GUILD_CATEGORY":
			return "Catégorie";
		case "GUILD_NEWS":
			return "News";
		default:
			return "Inconnu";
	}
};

const channelUpdate: DiscordEvent = {
	name: "channelUpdate",
	once: false,
	execute: async (oldChannel: GuildChannel, newChannel: GuildChannel) => {
		const { guild } = newChannel;
		const channel = guild.channels.cache.get(env.bot.userUpdateLoggingChannelByGuild[guild.id]);

		if (channel && channel.isText()) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User).setTitle(
				"Valve thermostatique administrative"
			);

			embed.setDescription(`Mise à jour du salon ${channelMention(oldChannel.id)}`);

			if (oldChannel.name !== newChannel.name) {
				embed.addField("Changement de nom", `${oldChannel.name} => ${newChannel.name}`);
			}

			if (oldChannel.position !== newChannel.position) {
				embed.addField("Changement de position", `${oldChannel.position} => ${newChannel.position}`);
			}

			if (oldChannel.isVoice()) {
				if (newChannel.isVoice()) {
					if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
						embed.addField("Changement de région", `${oldChannel.rtcRegion} => ${newChannel.rtcRegion}`);
					}
				} else {
					embed.addField("Changement de type", `Vocal => ${getType(newChannel.type)}`);
				}
			} else if (oldChannel.isText()) {
				if (newChannel.isText()) {
					if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {
						embed.addField(
							"Changement de permissions",
							`${oldChannel.permissionOverwrites.cache} => ${newChannel.permissionOverwrites.cache}`
						);
					}
				} else {
					embed.addField("Changement de type", `Texte => ${getType(newChannel.type)}`);
				}
			} else if (oldChannel.isDirectory()) {
				if (newChannel.isDirectory()) {
					if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {
						embed.addField(
							"Changement de permissions",
							`${oldChannel.permissionOverwrites.cache} => ${newChannel.permissionOverwrites.cache}`
						);
					}
				} else {
					embed.addField("Changement de type", `Dossier => ${getType((<GuildChannel>newChannel).type)}`);
				}
			}

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = channelUpdate;
