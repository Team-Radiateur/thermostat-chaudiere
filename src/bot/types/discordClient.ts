import Database from "better-sqlite3";
import { Client, Collection, Intents, TextChannel } from "discord.js";

import { DiscordCommand } from "./discordEvents";
import { Player } from "discord-player";
import { logger } from "../../helpers/logger";

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
					Intents.FLAGS.DIRECT_MESSAGES,
					Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
					Intents.FLAGS.DIRECT_MESSAGE_TYPING,
					Intents.FLAGS.GUILD_SCHEDULED_EVENTS
				]
			});

			DiscordClient.database = new Database(`${__dirname}/../../../../data/bot.sqlite`);
			DiscordClient.commands = new Collection();
		}

		return DiscordClient.instance;
	};
}

export class DiscordPlayer {
	private static player: Player;

	public static getInstance = (): Player => {
		if (!DiscordPlayer.player) {
			DiscordPlayer.player = new Player(
				DiscordClient.getInstance(),
			);

			DiscordPlayer.player.on(
				"trackStart",
				async (queue, track) =>
					await (queue.metadata as { channel: TextChannel })
						.channel
						.send(`🎶 | En cours de lecture **${track.title}** !`)
			);
			DiscordPlayer.player.on(
				"channelEmpty",
				async (queue) => {
					await (queue.metadata as { channel: TextChannel })
						.channel
						.send("👀 | Tout le monde a quitté le canal, donc je me casse aussi");
					queue.destroy(true);
				}
			);
			DiscordPlayer.player.on(
				"error",
				async (queue, error) => {
					logger.error(error.message);
					await (queue.metadata as { channel: TextChannel })
						.channel
						.send("❌ | Une erreur est survenue lors de la lecture de la playlist");
				}
			);
		}

		return DiscordPlayer.player;
	};
}
