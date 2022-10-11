import { HexColorString, Snowflake } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const guilds = (process.env.GUILDS || "").split(",").filter(guild => guild !== "");
const guildReducer = (accumulator: { [guild: string]: string }, channelOrUserByGuild: string) => {
	const [guild, channelOrUser] = channelOrUserByGuild.split(":");
	if (guild && channelOrUser && guilds.find(guildId => guildId === guild)) {
		accumulator[guild] = <Snowflake>channelOrUser;
	}

	return accumulator;
};

export const env = {
	env: process.env.ENV || process.env.NODE_ENV || "local", // ["local", "dev", "preproduction", "production"]
	api: {
		port: process.env.SERVER_PORT || 8081
	},
	bot: {
		token: process.env.BOT_TOKEN || "",
		clientId: process.env.CLIENT_ID || "",
		ownerId: process.env.OWNER_ID || "",
		botName: process.env.BOT_NAME || "",
		color: `#${process.env.BOT_COLOR || "00ffff"}` as HexColorString,
		modsIds: (process.env.MODS_IDS || "").split(",").filter(id => id !== ""),
		guilds: guilds,
		announcementChannelByGuild: (process.env.ANNOUNCEMENT_CHANNELS_BY_GUILD || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce((accumulator, channelGuild) => {
				const [guild, channel, toTag] = channelGuild.split(":");
				if (guild && channel && toTag && guilds.find(guildId => guildId === guild)) {
					accumulator[guild] = {
						channel: <Snowflake>channel,
						toTag: <Snowflake>toTag
					};
				}

				return accumulator;
			}, {} as { [guild: Snowflake]: { channel: Snowflake; toTag: Snowflake } }),
		voiceLoggingChannelByGuild: (process.env.VOICE_LOGGING_CHANNEL_BY_GUILD || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce(guildReducer, {} as { [guild: Snowflake]: Snowflake }),
		userUpdateLoggingChannelByGuild: (process.env.USER_UPDATE_LOGGING_CHANNEL_BY_GUILD || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce(guildReducer, {} as { [guild: Snowflake]: Snowflake }),
		roleToTagOnUserRemove: (process.env.ROLE_TO_TAG_ON_USER_REMOVE || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce(guildReducer, {} as { [guild: Snowflake]: Snowflake }),
		musicChannels: (process.env.MUSIC_CHANNELS || "").split(",").filter(channel => channel !== ""),
		rolesChannelId: process.env.ROLES_CHANNEL_ID || "",
		pollChannelByGuild: (process.env.POLL_CHANNEL_BY_GUILD || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce(guildReducer, {} as { [guild: Snowflake]: Snowflake }),
		pollResultChannelByGuild: (process.env.POLL_RESULTS_CHANNEL_BY_GUILD || "")
			.split(",")
			.filter(channel => channel !== "")
			.reduce(guildReducer, {} as { [guild: Snowflake]: Snowflake })
	},
	external: {
		lyricsApi: {
			url: process.env.LYRICS_API_URL || "",
			username: process.env.LYRICS_API_USERNAME || "",
			password: process.env.LYRICS_API_PASSWORD || ""
		}
	}
};
