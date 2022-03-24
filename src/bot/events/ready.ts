import { logger } from "../../helpers/logger";
import { DiscordEvent } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";

module.exports = {
	name: "ready",
	once: true,
	execute: () => {
		logger.info("La Chaudière est connectée au Radiateur, le circuit d'eau ne fuite pas !");

		setInterval(() => {
			const temperature = Math.floor(Math.random() * 70 + 21);
			DiscordClient.getInstance().user?.setActivity(`Température : ${temperature}°C`);
		}, 5000);
	}
} as DiscordEvent;
