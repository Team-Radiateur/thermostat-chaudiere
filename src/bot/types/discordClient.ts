import { ClientWithSelfRoleManager as SelfRoleManager } from "@hunteroi/discord-selfrole";
import { SelfRoleOptions } from "@hunteroi/discord-selfrole/lib/types";
import Database from "better-sqlite3";
import { Player, PlayerInitOptions } from "discord-player";
import { ClientOptions, Collection, IntentsBitField, Snowflake, TextChannel } from "discord.js";
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
						IntentsBitField.Flags.Guilds,
						IntentsBitField.Flags.GuildMembers,
						IntentsBitField.Flags.GuildModeration,
						IntentsBitField.Flags.GuildEmojisAndStickers,
						IntentsBitField.Flags.GuildIntegrations,
						IntentsBitField.Flags.GuildWebhooks,
						IntentsBitField.Flags.GuildInvites,
						IntentsBitField.Flags.GuildVoiceStates,
						IntentsBitField.Flags.GuildPresences,
						IntentsBitField.Flags.GuildMessages,
						IntentsBitField.Flags.GuildMessageReactions,
						IntentsBitField.Flags.GuildMessageTyping,
						IntentsBitField.Flags.GuildScheduledEvents,
						IntentsBitField.Flags.MessageContent
					]
				},
				{
					channelsMessagesFetchLimit: 10,
					deleteAfterUnregistration: true,
					useReactions: false
				}
			);
		}

		return DiscordClient.instance;
	};
}

export class DiscordPlayer extends Player {
	private static instance: DiscordPlayer;
	private channels: Collection<Snowflake, TextChannel>;

	private constructor(client: DiscordClient, options: PlayerInitOptions) {
		super(client, options);
		this.channels = new Collection();

		env.bot.musicChannels.forEach(channel => {
			const textChannel = DiscordClient.getInstance().channels.cache.get(channel) as TextChannel;

			this.channels.set(channel, textChannel);
		});

		this.events
			.on("playerStart", async (queue, song) => {
				const channel = this.channels.get(queue.guild.id);
				await channel?.send(`🎶 | En cours de lecture **${song.title}** (${song.url}) !`);
			})
			.on("emptyChannel", async queue => {
				const channel = this.channels.get(queue.guild.id);

				await channel?.send("😬 | Bon bah y'a plus personne... Je me casse aussi");
			})
			.on("disconnect", async queue => {
				const channel = this.channels.get(queue.guild.id);

				await channel?.send("➡️🚪 | Allez, mon ami (Drake) et ses connaissances, j'me casse !");
			})
			.on("error", async (queue, error) => {
				const channel = this.channels.get(queue.guild.id);

				logger.error(`Une erreur est survenue lors de la lecture de la musique\n${error}`);
				await channel?.send("❌ | Une erreur est survenue lors de la lecture de la playlist");
			})
			.on("emptyQueue", async () => {
				await new Promise(resolve => setTimeout(resolve, 30000));
			});
	}

	public static getInstance = (): Player => {
		if (!DiscordPlayer.instance) {
			DiscordPlayer.instance = new DiscordPlayer(DiscordClient.getInstance(), {
				autoRegisterExtractor: true
			});
		}

		return DiscordPlayer.instance;
	};
}
