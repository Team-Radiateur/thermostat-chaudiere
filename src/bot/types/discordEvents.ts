import { SlashCommandBuilder } from "@discordjs/builders";
import { ClientEvents, CommandInteraction } from "discord.js";

export type DiscordEvent = {
	name: keyof ClientEvents,
	once: boolean,
	execute: (() => void) | (() => Promise<void>)
}

export type DiscordCommand = {
	data: SlashCommandBuilder,
	execute: (interaction: CommandInteraction) => Promise<void>
}
