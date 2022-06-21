import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { Guild, GuildMember } from "discord.js";

import { prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { DiscordCommand } from "../types/discordEvents";

const goelette: DiscordCommand = {
	data: new SlashCommandBuilder().setName("goélette").setDescription("Goélette au rapport !") as SlashCommandBuilder,
	execute: async interaction => {
		const description = "Goélette au rapport !";
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle");
		const randomGuildUser = (interaction.guild as Guild).members.cache.random() as GuildMember;

		return await replyToInteraction(
			interaction,
			embed.setDescription(`${description} ${userMention(randomGuildUser.id)}`),
			false
		);
	}
};

module.exports = goelette;
