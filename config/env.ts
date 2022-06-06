import * as dotenv from "dotenv";
import { HexColorString } from "discord.js";

dotenv.config();

export const env = {
	env: process.env.ENV || process.env.NODE_ENV || "local", // ["local", "dev", "preprod", "production"]
	api: {
		port: process.env.SERVER_PORT || 8081
	},
	bot: {
		token: process.env.BOT_TOKEN || "",
		clientId: process.env.CLIENT_ID || "",
		ownerId: process.env.OWNER_ID || "",
		botName: process.env.BOT_NAME || "",
		color: (process.env.BOT_COLOR || "#00ffff") as HexColorString,
		guilds: (process.env.GUILDS || "").split(",").filter(guild => guild !== ""),
		voiceLoggingChannel: process.env.VOICE_LOGGING_CHANNEL || "",
		userUpdateLoggingChannel: process.env.USER_UPDATE_LOGGING_CHANNEL || "",
		musicChannels: (process.env.MUSIC_CHANNELS || "").split(",").filter(channel => channel !== "")
	}
};
