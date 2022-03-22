import { CommandInteraction, Guild, GuildMember, Permissions } from "discord.js";
import { setTimeout } from "timers/promises";
import { env } from "../../config/env";
import { DiscordPlayer } from "../bot/types/discordClient";

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

const checkCommand = async (
	interaction: CommandInteraction
) => {
	if (
		!env.bot.musicChannels.find(channel => channel === interaction.channel?.id)
		&& !interaction.memberPermissions?.has([Permissions.FLAGS.ADMINISTRATOR])
	) {
		return await replyToInteraction(
			interaction,
			"❌ | Vous devez envoyer cette commande dans un canal dédié !",
			true
		);
	}

	if (!(interaction.member instanceof GuildMember)) {
		throw new Error("Erreur de récupération de l'utilisateur");
	}

	const { channel } = interaction.member.voice;

	if (!channel) {
		return await replyToInteraction(
			interaction,
			"❌ | Vous devez être connecté à un salon vocal pour faire cela !",
			false
		);
	}

	let queue = DiscordPlayer.getInstance().getQueue(channel?.guild as Guild);

	if (!queue) {
		queue = DiscordPlayer.getInstance().createQueue(
			channel?.guild as Guild,
			{
				metadata: {
					channel: interaction.channel
				}
			}
		);
	}

	return { queue, channel };
};

export const macros = {
	notImplemented,
	todo,
	replyToInteraction,
	checkCommand
};
