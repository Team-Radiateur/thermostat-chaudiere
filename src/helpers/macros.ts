import { CommandInteraction } from "discord.js";
import { setTimeout } from "timers/promises";

const notImplemented = () => {
	const error = Object.assign(new Error("Not implemented"), { code: "ERR_UNIMPLEMENTED" });

	if (typeof Error.captureStackTrace === "function")
		Error.captureStackTrace(error, notImplemented);

	throw error;
};

const todo = () => {
	const error = Object.assign(new Error("Not yet implemented"), { code: "ERR_TODO" });

	if (typeof Error.captureStackTrace === "function")
		Error.captureStackTrace(error, todo);

	throw error;
};

const replyToInteraction = async (
	interaction: CommandInteraction,
	message: string,
	ephemeral = true
): Promise<void> => {
	await interaction.reply({ content: message, ephemeral: ephemeral });
	if (!ephemeral) {
		await setTimeout(5000);
		await interaction.deleteReply();
	}
};

export const macros = {
	notImplemented,
	todo,
	replyToInteraction
};
