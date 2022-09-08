import { channelMention, inlineCode } from "@discordjs/builders";
import { ChannelType, GuildChannel, User, VoiceChannel } from "discord.js";

import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { permissionToName } from "../../helpers/permissionsToName";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const getType = (type: ChannelType) => {
	switch (type) {
		case ChannelType.GuildText:
			return "salon textuel";
		case ChannelType.GuildVoice:
			return "salon vocal";
		case ChannelType.DM:
			return "salon privé";
		case ChannelType.GroupDM:
			return "salon de groupe";
		case ChannelType.GuildCategory:
			return "catégorie";
		case ChannelType.GuildNews:
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
		const channel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[guild.id]
		);

		if (channel && channel.type === ChannelType.GuildText) {
			const embed = prepareEmbed(DiscordClient.getInstance().user as User).setTitle(
				"Valve thermostatique administrative"
			);

			embed.setDescription(`Mise à jour du salon ${channelMention(oldChannel.id)}`);

			if (oldChannel.name !== newChannel.name) {
				embed.addFields({
					name: "Changement de nom",
					value: `${inlineCode(oldChannel.name)} => ${inlineCode(newChannel.name)}`,
					inline: false
				});
			}

			if (oldChannel.position !== newChannel.position) {
				embed.addFields({
					name: "Changement de position",
					value: `${oldChannel.position} => ${newChannel.position}`,
					inline: false
				});
			}

			if (oldChannel.type === ChannelType.GuildVoice) {
				if (newChannel.type === ChannelType.GuildVoice) {
					if ((oldChannel as VoiceChannel).rtcRegion !== (newChannel as VoiceChannel).rtcRegion) {
						embed.addFields({
							name: "Changement de région",
							value: `${(<VoiceChannel>oldChannel).rtcRegion} => ${(<VoiceChannel>newChannel).rtcRegion}`,
							inline: false
						});
					}
				} else {
					embed.addFields({
						name: "Changement de type",
						value: `Vocal => ${getType(newChannel.type)}`,
						inline: false
					});
				}
			} else if (channel.type === ChannelType.GuildText) {
				if (newChannel.type === ChannelType.GuildText) {
					if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {
						embed.addFields({
							name: `Changement de permissions pour ${newChannel.name}`,
							value: `${oldChannel.permissionOverwrites.cache
								.toJSON()
								.join(", ")} => ${newChannel.permissionOverwrites.cache.toJSON().join(", ")}`,
							inline: false
						});
					}
				} else {
					embed.addFields({
						name: "Changement de type",
						value: `Texte => ${getType(newChannel.type)}`,
						inline: false
					});
				}
			} else if (oldChannel.type === ChannelType.GuildCategory) {
				if (newChannel.type === ChannelType.GuildCategory) {
					if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {
						oldChannel.permissionOverwrites.cache
							.difference(newChannel.permissionOverwrites.cache)
							.map(permissionOverwrite => {
								embed.addFields(
									{
										name: `Permissions accordées pour ${newChannel.name}`,
										value: `${permissionOverwrite.allow
											.toArray()
											.map(permission => permissionToName(permission))
											.join(", ")}`,
										inline: false
									},
									{
										name: `Permissions refusées pour ${newChannel.name}`,
										value: `${permissionOverwrite.deny
											.toArray()
											.map(permission => permissionToName(permission))
											.join(", ")}`,
										inline: false
									}
								);
							});
					}
				} else {
					embed.addFields({
						name: "Changement de type",
						value: `Dossier => ${getType((<GuildChannel>newChannel).type)}`,
						inline: false
					});
				}
			}

			await channel.send({ embeds: [embed] });
		}
	}
};

module.exports = channelUpdate;
