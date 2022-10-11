import { bold, roleMention } from "@discordjs/builders";
import { RoleToEmojiData } from "@hunteroi/discord-selfrole/lib/types";
import { Role } from "discord.js";
import { env } from "../../../config/env";
import { logger } from "../../helpers/logger";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

async function registerRolesChannels(client: DiscordClient): Promise<void> {
	await client.selfRoleManager.registerChannel(env.bot.rolesChannelId, {
		rolesToEmojis: [
			{
				role: "914630777428410378", // Minecraft
				emoji: "<:minecraft:1029528088360538194>"
			},
			{
				role: "861357497108660245", // Modded Minecraft
				emoji: "<:ftb:1029528863627284491>"
			},
			{
				role: "1024576021707624478", // Satisfactory
				emoji: "<:satisfactory:1029528562685988917>"
			},
			{
				role: "918494068374392852", // Farming Simulator
				emoji: "<:fs22:1029529614265106452>"
			}
		],
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
