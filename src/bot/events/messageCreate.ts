import { Message } from "discord.js";

import { DiscordEvent } from "../types/discordEvents";
import { filter } from "../../helpers/botCommands";

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (message: Message) => {
		return await filter(message);
	}
} as DiscordEvent;
