import startBot from "./bot";
import { logger } from "./helpers/logger";

const startApp = async (): Promise<void> => {
	const botLoadingFinished = await startBot();

	if (!botLoadingFinished) {
		logger.error("Une erreur est survenue lors de l'initialisation du bot.");
		process.exit(1);
	}
};

startApp().then(() => {
	logger.info("Server ready!");
});
