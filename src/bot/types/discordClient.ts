import Database from "better-sqlite3";
import { Player } from "discord-music-player";
import { Client, Collection, Intents, Snowflake, TextChannel } from "discord.js";
import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";

import { DiscordCommand } from "./discordEvents";

export class DiscordClient {
	public static database: Database.Database;
	public static commands: Collection<string, DiscordCommand>;
	private static instance: Client;

	public static getInstance: () => Client = () => {
		if (!DiscordClient.instance) {
			DiscordClient.instance = new Client({
				allowedMentions: {
					parse: ["users", "roles"],
					repliedUser: true
				},
				intents: [
					Intents.FLAGS.GUILDS,
					Intents.FLAGS.GUILD_MEMBERS,
					Intents.FLAGS.GUILD_BANS,
					Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
					Intents.FLAGS.GUILD_INTEGRATIONS,
					Intents.FLAGS.GUILD_WEBHOOKS,
					Intents.FLAGS.GUILD_INVITES,
					Intents.FLAGS.GUILD_VOICE_STATES,
					Intents.FLAGS.GUILD_PRESENCES,
					Intents.FLAGS.GUILD_MESSAGES,
					Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
					Intents.FLAGS.GUILD_MESSAGE_TYPING,
					Intents.FLAGS.GUILD_SCHEDULED_EVENTS
				]
			});

			DiscordClient.database = new Database(`${__dirname}/../../../../resources/databases/bot.sqlite`);
			DiscordClient.commands = new Collection();
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
				quality: "high"
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
