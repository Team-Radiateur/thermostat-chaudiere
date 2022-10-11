import { REST } from "@discordjs/rest";
import { SelfRoleManagerEvents } from "@hunteroi/discord-selfrole";
import { Routes } from "discord-api-types/v10";
import { ButtonInteraction, GuildMember, Role, TextChannel } from "discord.js";
import { readdir } from "fs/promises";
import { env } from "../../config/env";

import { logger } from "../helpers/logger";
import { DiscordClient } from "./types/discordClient";
import { DiscordEvent } from "./types/discordEvents";

const startBot = async (): Promise<boolean> => {
	const client = DiscordClient.getInstance()
		.on(SelfRoleManagerEvents.channelRegister, (channel: TextChannel, options) =>
			console.log(
				`Le canal ${channel.name} (${channel.id}) a bien été inscrit avec les options suivantes :`,
				options
			)
		)
		.on(SelfRoleManagerEvents.channelUnregister, (channel: TextChannel, options) =>
			console.log(
				`Le canal ${channel.name} (${channel.id}) a bien été désinscrit des options suivantes : `,
				options
			)
		)
		.on(SelfRoleManagerEvents.roleAdd, (role: Role, member: GuildMember) => {
			logger.info(`Ajout de ${role.name} à ${member.user.tag}`);
		})
		.on(SelfRoleManagerEvents.roleRemove, (role: Role, member: GuildMember) => {
			logger.info(`${member.user.tag} vient de se retirer le rôle ${role.name}`);
		})
		.on(
			SelfRoleManagerEvents.maxRolesReach,
			async (member: GuildMember, interaction: ButtonInteraction, nbRoles: number, maxRoles: number) => {
				logger.info(
					`${member.user.tag} a atteint ou excédé le nombre maximum de rôles (${nbRoles}/${maxRoles}) !`
				);

				await interaction.editReply({
					content: `You reached or exceed the maximum number of roles (${nbRoles}/${maxRoles})!`
				});
			}
		)
		.on(SelfRoleManagerEvents.error, error => {
			logger.error(`Une erreur est survenue :\n${error}`);
		});
	const fullyLoaded = false;

	try {
		const commandFiles = (await readdir(`${__dirname}/commands`)).filter(file => file.endsWith(".js"));
		const commands = [];
		const eventFiles = (await readdir(`${__dirname}/events`)).filter(file => file.endsWith(".js"));

		for (const file of commandFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(`${__dirname}/commands/${file}`);

			DiscordClient.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: "10" }).setToken(env.bot.token);

		try {
			logger.info("Démarrage du rafraichissement des (/) commands.");

			for (const guild of env.bot.guilds) {
				logger.info(`Rafraichissement de commandes de ${guild}...`);
				await rest.put(Routes.applicationGuildCommands(env.bot.clientId, guild), { body: commands });
			}

			logger.info("Rafraichissement des commandes (/) réussi.");
		} catch (error) {
			logger.error(`Une erreur est survenue durant le rafraichissement :\n${(<Error>error).message}`);
		}

		for (const file of eventFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const event = require(`${__dirname}/events/${file}`) as DiscordEvent;

			if (event.once) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				client.once(event.name, (...args) => {
					try {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						event.execute(...args);
					} catch (error) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						logger.error(error);
					}
				});
			} else {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				client.on(event.name, (...args) => {
					try {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						event.execute(...args);
					} catch (error) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						logger.error(error);
					}
				});
			}
		}
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		logger.error(error.message);
	}

	await client.login(env.bot.token);

	while (!fullyLoaded) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}

	return true;
};

export default startBot;
