import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { CommandInteractionOptionResolver, Guild, GuildMember } from "discord.js";

import { prepareEmbed } from "../../helpers/macros";
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
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle");
		const guildMember =
			(interaction.options as CommandInteractionOptionResolver).getMentionable("personne") ||
			((interaction.guild as Guild).members.cache.random() as GuildMember);

		return await interaction.reply({
			content: userMention((<GuildMember>guildMember).id),
			embeds: [embed.setDescription("Goélette au rapport !")]
		});
	}
};

module.exports = goelette;
