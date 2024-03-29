import {
	CommandInteraction,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
	PermissionsBitField,
	User
} from "discord.js";
import { setTimeout } from "timers/promises";
import { env } from "../../config/env";
import { DiscordClient, DiscordPlayer } from "../bot/types/discordClient";

export const notImplemented = () => {
	const error = Object.assign(new Error("Not implemented"), {
		code: "ERR_UNIMPLEMENTED"
	});

	if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(error, notImplemented);

	throw error;
};

export const todo = () => {
	const error = Object.assign(new Error("Not yet implemented"), {
		code: "ERR_TODO"
	});

	if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(error, todo);

	throw error;
};

export const replyToInteraction = async (
	interaction: CommandInteraction,
	message: string | EmbedBuilder,
	ephemeral = true,
	deleteAfter5s = false
): Promise<void> => {
	if (typeof message === "string") {
		await interaction.reply({ content: message, ephemeral: ephemeral });
	} else {
		await interaction.reply({ embeds: [message], ephemeral: ephemeral });
	}

	if (!ephemeral && deleteAfter5s) {
		await setTimeout(5000);
		await interaction.deleteReply();
	}
};

export const prepareEmbed = (user: User): EmbedBuilder => {
	return new EmbedBuilder()
		.setAuthor({
			name: user.username,
			iconURL: user.displayAvatarURL()
		})
		.setColor(env.bot.color)
		.setTimestamp()
		.setFooter({
			text: "Thermostat",
			iconURL: (DiscordClient.getInstance().user as User).displayAvatarURL()
		});
};

export const prepareResponseToInteraction = async (interaction: CommandInteraction) => {
	if (
		!env.bot.musicChannels.find(channel => channel === interaction.channel?.id) &&
		!interaction.memberPermissions?.has([PermissionsBitField.Flags.Administrator])
	) {
		return await replyToInteraction(
			interaction,
			prepareEmbed(interaction.user)
				.setTitle("Valve thermostatique générale")
				.setDescription("Tu t'es pris pour qui là ?"),
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
			prepareEmbed(interaction.user)
				.setTitle("Valve thermostatique musicale")
				.setDescription("Vous devez être connecté à un salon vocal pour faire cela !"),
			false
		);
	}

	const queue =
		DiscordPlayer.getInstance().queues.get(channel.guild) ||
		DiscordPlayer.getInstance().queues.create(channel.guild);

	return {
		queue,
		channel,
		embed: prepareEmbed(interaction.user).setTitle("Valve thermostatique musicale")
	};
};

export const isAllowed = (member: GuildMember | undefined) => {
	return env.bot.modsIds.some(id =>
		Array.isArray(member?.roles)
			? (member?.roles as string[]).includes(id)
			: (member?.roles as GuildMemberRoleManager).cache.has(id)
	);
};
