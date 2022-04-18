import { VoiceState } from "discord.js";

import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";

import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const voiceStateUpdate: DiscordEvent = {
	name: "voiceStateUpdate",
	once: false,
	execute: (oldState: VoiceState, newState: VoiceState) => {
		const newUserChannel = newState.channel;
		const oldUserChannel = oldState.channel;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(env.bot.voiceLoggingChannel);

		if (!oldUserChannel) {
			if (newUserChannel) {
				const message = `${newState.member?.displayName} s'est connecté au salon ${newUserChannel.name}`;
				if (loggingChannel?.isText()) loggingChannel.send(message);

				logger.info(message);
			} else {
				return;
			}
		} else if (!newUserChannel) {
			const message = `${oldState.member?.displayName} s'est déconnecté du salon ${oldUserChannel?.name}`;

			if (loggingChannel?.isText()) loggingChannel.send(message);

			logger.info(message);
		} else if (oldUserChannel.id !== newUserChannel.id) {
			// eslint-disable-next-line max-len
			const message = `${oldState.member?.displayName} a changé de salon : ${oldUserChannel.name} => ${newUserChannel.name}`;

			if (loggingChannel?.isText()) loggingChannel.send(message);

			logger.info(message);
		}
	}
};

module.exports = voiceStateUpdate;
