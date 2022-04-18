import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ConstantsEvents } from "discord.js";
import { ValueOf } from "../../helpers/types";

export type DiscordEvent = {
	name: ValueOf<ConstantsEvents>;
	once: boolean;
	execute: ((...data: never) => void) | ((...data: never) => Promise<void>);
};

export type DiscordCommand = {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<unknown>;
};
