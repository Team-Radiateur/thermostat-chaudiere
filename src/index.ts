import startBot from "./bot";
import { logger } from "./helpers/logger";

const startApp = async (): Promise<void> => {
	logger.info("Démarrage du bot...");
	const botLoadingFinished = await startBot();

	if (!botLoadingFinished) {
		logger.error("Une erreur est survenue lors de l'initialisation du bot.");
		process.exit(1);
	} else {
		logger.info("Le bot a démarré !");
	}
};

startApp();

process.on("beforeExit", () => {
	logger.info("Stopping the bot...");
});
