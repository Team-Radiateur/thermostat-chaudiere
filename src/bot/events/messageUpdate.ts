import { Message } from "discord.js";

import { DiscordEvent } from "../types/discordEvents";
import { filter } from "../../helpers/botCommands";

module.exports = {
	name: "messageUpdate",
	once: false,
	execute: async (_oldMessage: Message, newMessage: Message) => {
		return await filter(newMessage);
	}
} as DiscordEvent;
