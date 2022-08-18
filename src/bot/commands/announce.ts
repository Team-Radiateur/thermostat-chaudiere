import { roleMention, SlashCommandBuilder } from "@discordjs/builders";
import { Guild, PermissionsBitField, TextChannel } from "discord.js";

import { env } from "../../../config/env";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";

import { DiscordCommand } from "../types/discordEvents";

const announce: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("annoncer")
		.setDescription("Permet aux administrateurs de faire des annonces à la communauté")
		.addStringOption(option =>
			option.setName("message").setDescription("Le message à envoyer").setRequired(true)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle");

		if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
			return await replyToInteraction(
				interaction,
				embed.setDescription("Eh, oh ! Tu t'es pris pour qui là, Marseillais ?")
			);
		}
		const channelAndToTag = env.bot.announcementChannelByGuild[(interaction.guild as Guild).id];

		const announcementChannel = (interaction.guild as Guild).channels.cache.find(
			channel => channel.id === channelAndToTag.channel
		);

		if (!announcementChannel || !(announcementChannel instanceof TextChannel)) {
			return await replyToInteraction(
				interaction,
				embed.setDescription("Le canal de publication n'est pas correctement configuré")
			);
		}

		embed.setDescription(interaction.options.get("message", true).value as string);

		await announcementChannel.send({ content: roleMention(channelAndToTag.toTag), embeds: [embed] });

		return await replyToInteraction(interaction, embed.setDescription("Annonce envoyée"), true);
	}
};

module.exports = announce;
