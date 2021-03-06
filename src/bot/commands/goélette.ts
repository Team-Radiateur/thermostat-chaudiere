import { roleMention, SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Guild, GuildMember, Role, User } from "discord.js";

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
			(interaction.options.getMentionable("personne") as User | GuildMember | Role | null) ||
			((interaction.guild as Guild).members.cache.random() as GuildMember);

		return await interaction.reply({
			content: guildMember instanceof GuildMember ? userMention(guildMember.id) : roleMention(guildMember.id),
			embeds: [embed.setDescription("Goélette au rapport !")]
		});
	}
};

module.exports = goelette;
