import * as dotenv from "dotenv";

dotenv.config();

export const env = {
	env: process.env.ENV || process.env.NODE_ENV || "local", // ["local", "dev", "preprod", "production"]
	bot: {
		api_port: process.env.SERVER_PORT || 8081,
		token: process.env.BOT_TOKEN || "",
		clientId: process.env.CLIENT_ID || "",
		ownerId: process.env.OWNER_ID || "",
		botName: process.env.BOT_NAME || "",
		commandPrefix: process.env.COMMAND_PREFIX || "",
		guilds: (process.env.GUILDS || "").split(",").filter(guild => guild !== ""),
		loggingChannel: process.env.LOGGING_CHANNEL || "",
		musicChannels: (process.env.MUSIC_CHANNELS || "").split(",").filter(channel => channel !== "")
	}
};
