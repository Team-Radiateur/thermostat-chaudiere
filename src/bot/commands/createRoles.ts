import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";

import { DiscordCommand } from "../types/discordEvents";

const createRoles: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("roles")
		.setDescription(
			"Crée l'embed d'ajout de rôles et l'envoie dans le canal correspondant s'il n'existe pas encore"
		) as SlashCommandBuilder,
	execute: async interaction => {
		if (interaction.user.bot) {
			return;
		}

		const permissions = new PermissionsBitField(<Readonly<PermissionsBitField>>interaction.member?.permissions);
		if (!permissions.has("Administrator")) {
			return await replyToInteraction(
				interaction,
				prepareEmbed(interaction.user)
					.setTitle("Valve thermostatique générale")
					.setDescription(
						"Tu t'es pris pour qui là ? Seulement les administrateurs ont accès à cette commande !"
					),
				true
			);
		}

		const { guild } = interaction;

		if (!guild) {
			return;
		}

		const channel: TextChannel = (await DiscordClient.getInstance().channels.fetch(
			env.bot.rolesChannelsIds[guild.id]
		)) as TextChannel;

		const embed = new EmbedBuilder()
			.setTitle("Attribuez-vous les rôles qui vous intéressent grâce aux boutons suivants...")
			.setColor(env.bot.color)
			.setAuthor({
				name: DiscordClient.getInstance().user!.username,
				iconURL: DiscordClient.getInstance().user!.avatarURL()!
			})
			.setTimestamp(new Date())
			.setImage(DiscordClient.getInstance().user!.avatarURL());

		await channel.send({ embeds: [embed] });

		return await replyToInteraction(interaction, "👌");
	}
};

module.exports = createRoles;
