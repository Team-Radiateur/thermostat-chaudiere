import startBot from "./bot";
import { logger } from "./helpers/logger";

const startApp = async (): Promise<void> => {
	logger.info("Starting the bot...");
	const botLoadingFinished = await startBot();

	if (!botLoadingFinished) {
		logger.error("Une erreur est survenue lors de l'initialisation du bot.");
		process.exit(1);
	} else {
		logger.info("Bot started !");
	}
};

startApp();

process.on("beforeExit", () => {
	logger.info("Stopping the bot...");
});
