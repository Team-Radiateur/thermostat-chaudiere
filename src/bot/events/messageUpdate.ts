import { Message } from "discord.js";

import { DiscordEvent } from "../types/discordEvents";
import { filter } from "../../helpers/botCommands";

const messageUpdate: DiscordEvent = {
	name: "messageUpdate",
	once: false,
	execute: async (_oldMessage: Message, newMessage: Message) => {
		return await filter(newMessage);
	}
};

module.exports = messageUpdate;
