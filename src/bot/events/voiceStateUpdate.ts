import { GuildMember, User, VoiceState } from "discord.js";

import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";
import { prepareEmbed } from "../../helpers/macros";

import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const voiceStateUpdate: DiscordEvent = {
	name: "voiceStateUpdate",
	once: false,
	execute: (oldState: VoiceState, newState: VoiceState) => {
		const newUserChannel = newState.channel;
		const oldUserChannel = oldState.channel;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(
			env.bot.voiceLoggingChannelByGuild[newState.guild.id]
		);

		if (!oldUserChannel) {
			if (newUserChannel) {
				const message = `${newState.member?.displayName} s'est connecté au salon ${newUserChannel.name}`;
				if (loggingChannel?.isText()) {
					loggingChannel.send({
						embeds: [prepareEmbed(newState.member?.user as User).setDescription(message)]
					});
				}

				logger.info(message);
			} else {
				return;
			}
		} else if (!newUserChannel) {
			const message = `${oldState.member?.displayName} s'est déconnecté du salon ${oldUserChannel?.name}`;

			if (loggingChannel?.isText()) {
				loggingChannel.send({ embeds: [prepareEmbed(oldState.member?.user as User).setDescription(message)] });
			}

			logger.info(message);
		} else if (oldUserChannel.id !== newUserChannel.id) {
			const { displayName } = oldState.member as GuildMember;
			const message = `${displayName} a changé de salon : ${oldUserChannel.name} => ${newUserChannel.name}`;

			if (loggingChannel?.isText()) {
				loggingChannel.send({ embeds: [prepareEmbed(oldState.member?.user as User).setDescription(message)] });
			}

			logger.info(message);
		}
	}
};

module.exports = voiceStateUpdate;
