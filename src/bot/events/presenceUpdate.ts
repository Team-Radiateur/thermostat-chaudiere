import { DiscordEvent } from "../types/discordEvents";
import { Presence } from "discord.js";

const presenceUpdate: DiscordEvent = {
	name: "presenceUpdate",
	once: false,
	execute: async (oldPresence: Presence | undefined, newPresence: Presence) => {
		oldPresence;
		newPresence;
		//console.log("Presence update detected");
	}
};

module.exports = presenceUpdate;
