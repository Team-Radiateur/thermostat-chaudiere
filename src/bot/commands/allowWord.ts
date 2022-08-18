import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";

import { BannedWord } from "../../databases/sqlite/bannedWord";
import { prepareEmbed, replyToInteraction } from "../../helpers/macros";
import { string } from "../../helpers/string";
import { DiscordClient } from "../types/discordClient";

import { DiscordCommand } from "../types/discordEvents";

const allowWord: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("permettre_mot")
		.setDescription("Permet le mot ou la phrase spécifié(e)")
		.addStringOption(option =>
			option.setName("mot").setDescription("Le mot à permettre").setRequired(true)
		) as SlashCommandBuilder,
	execute: async interaction => {
		const embed = prepareEmbed(interaction.user).setTitle("Valve thermostatique textuelle");

		if (!interaction.memberPermissions?.has([PermissionsBitField.Flags.BanMembers]))
			return await replyToInteraction(
				interaction,
				embed
					.setTitle("Valve thermostatique générale")
					.setDescription("🚫 | Tout doux, bijou... T'as cru que t'avais le droit de faire ça ?"),
				true
			);

		const { value: toHandle } = interaction.options.get("mot", true);
		const words = DiscordClient.database.prepare("select * from banned_words;").all() as BannedWord[];
		const filteredWords = words.filter(
			obj => string.normalized(obj.word) === string.normalized((toHandle as string) || "")
		);

		if (filteredWords.length && words[0].enabled) {
			const updateStatement = DiscordClient.database.prepare(
				// eslint-disable-next-line max-len
				"update banned_words set enabled = (@enabled), update_date = datetime('now', 'localtime') where id = (@id);"
			);

			DiscordClient.database.transaction(() => {
				updateStatement.run({
					enabled: 0,
					update_date: new Date().toLocaleTimeString(),
					id: words[0].id
				});
			})();

			await replyToInteraction(interaction, embed.setDescription("✅ | Mot correctement mis à jour !"));
		}
	}
};

module.exports = allowWord;
