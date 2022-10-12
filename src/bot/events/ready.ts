import { bold, roleMention } from "@discordjs/builders";
import { RoleToEmojiData } from "@hunteroi/discord-selfrole/lib/types";
import { Role } from "discord.js";
import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

async function registerRolesChannels(client: DiscordClient): Promise<void> {
	await client.selfRoleManager.registerChannel(env.bot.rolesChannelId, {
		rolesToEmojis: [...env.bot.roleEmojiPairs],
		message: {
			options: {
				sendAsEmbed: true,
				format: (rte: RoleToEmojiData) =>
					`${rte.emoji} - ${rte.role instanceof Role ? rte.role : roleMention(rte.role)}${
						rte.smallNote ? ` (${rte.smallNote})` : ""
					}`,
				descriptionPrefix: bold(
					// eslint-disable-next-line max-len
					"Réagissez à ce message avec la réaction correspondante pour vous attribuer/retirer le rôle souhaité!"
				)
			}
		}
	});
}

const ready: DiscordEvent = {
	name: "ready",
	once: true,
	execute: async () => {
		logger.info("La Chaudière est connectée au Radiateur, le circuit d'eau ne fuite pas !");

		setInterval(() => {
			const temperature = Math.floor(Math.random() * 70 + 21);
			DiscordClient.getInstance().user?.setActivity(`🌡 | Température : ${temperature}°C`);
		}, 5000);

		await registerRolesChannels(DiscordClient.getInstance());
	}
};

module.exports = ready;
