import { DiscordCommand } from "../types/discordEvents";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Guild, GuildMember, Permissions, VoiceChannel } from "discord.js";

import { macros } from "../../helpers/macros";
import { DiscordPlayer } from "../types/discordClient";
import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
	NoSubscriberBehavior,
	VoiceConnection,
	VoiceConnectionStatus
} from "@discordjs/voice";
import { logger } from "../../helpers/logger";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("renarde")
		.setDescription("Autocomplétion de la Renarde de ses morts"),
	execute: async (interaction) => {
		if (!interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])) {
			return await macros.replyToInteraction(
				interaction,
				"Tu n'as pas les permissions pour faire ça, Parisien !"
			);
		}

		const channel = (interaction.member as GuildMember).voice;

		if (!channel) {
			return await macros.replyToInteraction(
				interaction,
				"Tu dois être dans un salon vocal pour faire ça !"
			);
		}

		await macros.replyToInteraction(
			interaction,
			"J'espère que tu sais ce que tu fais..."
		);

		const discordPlayerQueue = DiscordPlayer.getInstance().getQueue(interaction.guild as Guild);

		let connection: VoiceConnection | undefined;

		if (discordPlayerQueue) {
			discordPlayerQueue.setPaused(true);

			connection = getVoiceConnection(channel.guild.id);
		} else {
			connection = joinVoiceChannel(
				{
					channelId: (channel.channel as VoiceChannel).id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator
				},
			);
		}

		connection?.on(VoiceConnectionStatus.Ready, () => {
			const player = createAudioPlayer(
				{
					debug: false,
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Stop,
					}
				}
			);

			const sound = createAudioResource("./sounds/renarde.m4a");
			connection?.subscribe(player);
			player.play(sound);

			player.on(AudioPlayerStatus.Idle, () => {
				if (discordPlayerQueue) {
					discordPlayerQueue.setPaused(false);
				} else {
					connection?.disconnect();
				}
			});

			player.on("error", (err) => {
				logger.error(err.message);
			});
		});
	}
} as DiscordCommand;
