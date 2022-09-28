import { ClientWithSelfRoleManager as SelfRoleManager } from "@hunteroi/discord-selfrole";
import { SelfRoleOptions } from "@hunteroi/discord-selfrole/lib/types";
import Database from "better-sqlite3";
import { Player } from "discord-music-player";
import { ClientOptions, Collection, GatewayIntentBits, Snowflake, TextChannel } from "discord.js";
import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";

import { DiscordCommand } from "./discordEvents";

export class DiscordClient extends SelfRoleManager {
	public static database: Database.Database;
	public static commands: Collection<string, DiscordCommand>;
	private static instance: SelfRoleManager;

	private constructor(options: ClientOptions, selfRoleOptions: SelfRoleOptions) {
		super(options, selfRoleOptions);

		DiscordClient.database = new Database(`${__dirname}/../../../../data/bot.sqlite`);
		DiscordClient.commands = new Collection();
	}

	public static getInstance: () => SelfRoleManager = () => {
		if (!DiscordClient.instance) {
			DiscordClient.instance = new DiscordClient(
				{
					allowedMentions: {
						parse: ["users", "roles"],
						repliedUser: true
					},
					intents: [
						GatewayIntentBits.Guilds,
						GatewayIntentBits.GuildMembers,
						GatewayIntentBits.GuildBans,
						GatewayIntentBits.GuildEmojisAndStickers,
						GatewayIntentBits.GuildIntegrations,
						GatewayIntentBits.GuildWebhooks,
						GatewayIntentBits.GuildInvites,
						GatewayIntentBits.GuildVoiceStates,
						GatewayIntentBits.GuildPresences,
						GatewayIntentBits.GuildMessages,
						GatewayIntentBits.GuildMessageReactions,
						GatewayIntentBits.GuildMessageTyping,
						GatewayIntentBits.GuildScheduledEvents,
						GatewayIntentBits.MessageContent
					]
				},
				{
					channelsMessagesFetchLimit: 0,
					deleteAfterUnregistration: true,
					useReactions: false
				}
			);
		}

		return DiscordClient.instance;
	};
}

export class DiscordPlayer {
	private static player: Player;
	private static channels: Collection<Snowflake, TextChannel>;

	public static getInstance = (): Player => {
		if (!DiscordPlayer.player) {
			DiscordPlayer.player = new Player(DiscordClient.getInstance(), {
				leaveOnEmpty: true,
				quality: "high",
				deafenOnJoin: false,
				timeout: 0
			});
			DiscordPlayer.channels = new Collection();

			env.bot.musicChannels.forEach(channel => {
				const textChannel = DiscordClient.getInstance().channels.cache.get(channel) as TextChannel;

				DiscordPlayer.channels.set(channel, textChannel);
			});

			DiscordPlayer.player.on("songChanged", async (queue, song) => {
				const channel = DiscordPlayer.channels.get(queue.guild.id);
				await channel?.send(`🎶 | En cours de lecture **${song.name}** (${song.url}) !`);
			});
			DiscordPlayer.player.on("channelEmpty", async queue => {
				const channel = DiscordPlayer.channels.get(queue.guild.id);

				await channel?.send("😬 | Bon bah y'a plus personne... Je me casse aussi");
				queue.leave();
			});
			DiscordPlayer.player.on("clientDisconnect", async queue => {
				const channel = DiscordPlayer.channels.get(queue.guild.id);

				await channel?.send("➡️🚪 | Allez, mon ami (Drake) et ses connaissances, j'me casse !");
			});
			DiscordPlayer.player.on("error", async (error, queue) => {
				const channel = DiscordPlayer.channels.get(queue.guild.id);

				logger.error(error);
				await channel?.send("❌ | Une erreur est survenue lors de la lecture de la playlist");
			});
			DiscordPlayer.player.on("queueEnd", async () => {
				await new Promise(resolve => setTimeout(resolve, 30000));
			});
		}

		return DiscordPlayer.player;
	};
}
