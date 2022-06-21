import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Guild, GuildMember, Role, User } from "discord.js";

import { prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { DiscordCommand } from "../types/discordEvents";

const goelette: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("goélette")
		.setDescription("Goélette au rapport !")
		.addMentionableOption(option =>
			option
				.setName("personne")
				.setDescription("La personne à mentionner (si pas fourni, mentionne une personne aléatoirement)")
				.setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const description = "Goélette au rapport !";
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle");
		const guildMember =
			(interaction.options.getMentionable("personne") as User | GuildMember | Role | null) ||
			((interaction.guild as Guild).members.cache.random() as GuildMember);

		return await replyToInteraction(
			interaction,
			embed.setDescription(`${description} ${userMention(guildMember.id)}`),
			false
		);
	}
};

module.exports = goelette;
