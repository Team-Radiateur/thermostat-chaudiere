import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { readdir } from "fs/promises";
import { env } from "../../config/env";

import { logger } from "../helpers/logger";
import { DiscordClient } from "./types/discordClient";
import { DiscordEvent } from "./types/discordEvents";

const startBot = async (): Promise<boolean> => {
	const client = DiscordClient.getInstance();
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
			logger.info("Started refreshing application (/) commands.");

			for (const guild of env.bot.guilds) {
				logger.info(`Refreshing ${guild}'s commands...`);
				await rest.put(Routes.applicationGuildCommands(env.bot.clientId, guild), { body: commands });
			}

			logger.info("Successfully reloaded application (/) commands.");
		} catch (error) {
			console.error(error);
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
		logger.error(JSON.stringify(error), error.stack);
	}

	await client.login(env.bot.token);

	while (!fullyLoaded) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}

	return true;
};

export default startBot;
