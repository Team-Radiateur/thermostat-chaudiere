import { bold, SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, PermissionsBitField, TextBasedChannel, TextChannel } from "discord.js";
import ImageCharts from "image-charts";

import { env } from "../../../config/env";
import { emoji } from "../../helpers/emojiCharacters";
import { logger } from "../../helpers/logger";
import { replyToInteraction } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";

import { DiscordCommand } from "../types/discordEvents";

const poll: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("sonder")
		.setDescription("Lance un sondage dans le canal de votes")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.addStringOption(option => option.setName("question").setDescription("La question à poser").setRequired(true))
		.addStringOption(option => option.setName("réponse1").setDescription("La première réponse").setRequired(true))
		.addStringOption(option => option.setName("réponse2").setDescription("La deuxième réponse").setRequired(true))
		.addStringOption(option => option.setName("réponse3").setDescription("La troisième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse4").setDescription("La quatrième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse5").setDescription("La cinquième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse6").setDescription("La sixième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse7").setDescription("La septième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse8").setDescription("La huitième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse9").setDescription("La neuvième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse10").setDescription("La dixième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse11").setDescription("La onzième réponse").setRequired(false))
		.addStringOption(option => option.setName("réponse12").setDescription("La douzième réponse").setRequired(false))
		.addStringOption(option =>
			option.setName("réponse13").setDescription("La treizième réponse").setRequired(false)
		)
		.addStringOption(option =>
			option.setName("réponse14").setDescription("La quatorzième réponse").setRequired(false)
		)
		.addStringOption(option =>
			option.setName("réponse15").setDescription("La quinzième réponse").setRequired(false)
		) as SlashCommandBuilder,
	execute: async interaction => {
		if (interaction.user.bot) {
			return;
		}
		await interaction.deferReply();

		const channelId = env.bot.pollChannelByGuild[interaction.guildId as string];
		const channel = await DiscordClient.getInstance().channels.fetch(channelId);
		const today = new Date();
		if (!channel || !channel.isTextBased()) {
			logger.error(`Le canal spécifié (${channelId}) n'existe pas ou n'est pas un canal textuel !`);
			const embed = new EmbedBuilder()
				.setTitle("Une erreur est survenue")
				.setDescription(
					"Une erreur interne a eu lieu. Veuillez consulter les logs du Thermostat pour plus d'informations."
				)
				.setAuthor({
					name: DiscordClient.getInstance().user!.username,
					iconURL: DiscordClient.getInstance().user!.avatarURL()!
				})
				.setImage(DiscordClient.getInstance().user!.avatarURL())
				.setTimestamp(today);

			return await replyToInteraction(interaction, embed);
		}

		const allowedReactions: { [key: string]: string } = {};

		const { value: question } = interaction.options.get("question", true);
		const answers: Array<string> = [
			interaction.options.get("réponse1"),
			interaction.options.get("réponse2"),
			interaction.options.get("réponse3"),
			interaction.options.get("réponse4"),
			interaction.options.get("réponse5"),
			interaction.options.get("réponse6"),
			interaction.options.get("réponse7"),
			interaction.options.get("réponse8"),
			interaction.options.get("réponse9"),
			interaction.options.get("réponse10"),
			interaction.options.get("réponse11"),
			interaction.options.get("réponse12"),
			interaction.options.get("réponse13"),
			interaction.options.get("réponse14"),
			interaction.options.get("réponse15")
		]
			.filter(option => option !== null && option !== undefined)
			.map(option => option?.value as string)
			.filter(answer => answer !== undefined);

		const emojiAnswers = answers.reduce((acc, answer, index) => {
			acc.push({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				emoji: emoji[String.fromCharCode("a".charCodeAt(0) + index) as string] as string,
				answer
			});
			return acc;
		}, [] as Array<{ emoji: string; answer: string }>);

		const embed = new EmbedBuilder()
			.setTitle("Valve thermostatique sondeuse d'opinion")
			.setColor(env.bot.color)
			.setDescription(
				`${bold(question as string)}\n\nPropositions:\n${emojiAnswers
					.map(e => `${e.emoji} - ${e.answer}`)
					.join("\n")}`
			)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()! })
			.setTimestamp(today);

		const message = await (<TextBasedChannel>channel).send({ embeds: [embed] });
		logger.info(`Sondage ${message.id} créé.`);

		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setTitle("Valve thermostatique sondeuse d'opinion")
					.setColor(env.bot.color)
					.setDescription("Le sondage a bien été créé !")
					.setTimestamp(today)
					.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()! })
			]
		});

		for (const emojiAnswer of emojiAnswers) {
			await message.react(emojiAnswer.emoji);
			allowedReactions[emojiAnswer.emoji] = emojiAnswer.answer;
		}
		await message.react("❌");

		const globalReactionCollector = message.createReactionCollector().on("collect", (reaction, user) => {
			logger.info(`Réaction ${reaction.emoji.name} ajoutée au sondage ${message.id} par ${user.tag}.`);
		});

		const closingReactionCollector = message
			.createReactionCollector({
				filter: (reaction, user) => user.id === interaction.user.id && reaction.emoji.name === "❌"
			})
			.on("collect", async () => {
				logger.info(`Sondage ${message.id} fini. Création de l'image de résultats...`);
				const reactions = Object.entries(emojiAnswers).reduce((acc, [key, value]) => {
					acc[value.emoji] = -1;
					allowedReactions[value.emoji] = key;
					return acc;
				}, {} as { [key: string]: number });

				for (const reaction of message.reactions.cache.values()) {
					if (!(reaction.emoji.name! in allowedReactions)) {
						continue;
					}
					reactions[<string>reaction.emoji.name] += reaction.count;
				}

				const chart = new ImageCharts()
					.cht("p")
					.chco(env.bot.color)
					.chs("700x700")
					.chd(`a:${Object.values(reactions).join(",")}`)
					.chl(
						Object.keys(reactions)
							.map(
								(_value, index) => `Réponse ${String.fromCharCode("A".charCodeAt(0) + index)}` as string
							)
							.join("|")
					);

				const { guild } = interaction;

				if (!guild) {
					return;
				}

				const resultsChannel = (await DiscordClient.getInstance().channels.fetch(
					env.bot.pollResultChannelByGuild[interaction.guildId as string]
				)) as TextChannel;

				await message.edit({
					embeds: [
						new EmbedBuilder()
							.setTitle("Valve thermostatique sondeuse d'opinion")
							.setColor(env.bot.color)
							.setDescription(
								`${bold(
									question as string
								)}\n\nQuelle(s) valeur(s) vous intéresse(nt) le plus ?\n${emojiAnswers
									.map(e => `${e.emoji} - ${e.answer}`)
									.join("\n")}\n\n${bold("Sondage terminé !")}`
							)
							.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()! })
							.setTimestamp(today)
					]
				});
				await message.reactions.removeAll();
				await resultsChannel.send({
					embeds: [
						new EmbedBuilder()
							.setTitle("Valve thermostatique sondeuse d'opinion")
							.setColor(env.bot.color)
							.setDescription(
								`Voici les résultats du sondage lancé par ${
									interaction.user.username
								} le ${today.toLocaleDateString("fr")}`
							)
							.addFields(
								Object.entries(reactions).map(([key, value], index) => ({
									name: `${key} - ${emojiAnswers[index].answer}`,
									value: `${value} votes`,
									inline: true
								}))
							)
							.setImage(chart.toURL())
							.setTimestamp(new Date())
							.setFooter({ text: "Thermostat", iconURL: DiscordClient.getInstance().user!.avatarURL()! })
					]
				});

				globalReactionCollector.stop();
				closingReactionCollector.stop();
			});
	}
};

module.exports = poll;
