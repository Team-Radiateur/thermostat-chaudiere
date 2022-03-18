import { logger } from "../../helpers/logger";
import { DiscordEvent } from "../types/discordEvents";

module.exports = {
	name: "ready",
	once: true,
	execute: () => {
		logger.info("La Chaudière est connectée au Radiateur, le circuit d'eau ne fuite pas !");
	}
} as DiscordEvent;
