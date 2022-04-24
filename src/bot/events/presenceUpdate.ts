import { DiscordEvent } from "../types/discordEvents";
import { MessageEmbed, Presence } from "discord.js";
import { bold } from "@discordjs/builders";
import { DiscordClient } from "../types/discordClient";
import { env } from "../../../config/env";

const presenceUpdate: DiscordEvent = {
	name: "presenceUpdate",
	once: false,
	execute: async (oldPresence: Presence | undefined, newPresence: Presence) => {
		if (oldPresence?.user?.bot) return;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(env.bot.userUpdateLoggingChannel);
		if (!loggingChannel || !loggingChannel.isText()) return;
		const embed = new MessageEmbed()
			.setTitle(bold(`${oldPresence?.user?.tag} a mis à jour son profil !`))
			.setColor("#00ffff")
			.setFooter({ text: `ID de l'utilisateur: ${newPresence.userId} • ${new Date().toLocaleString("fr")}` })
			.setAuthor({ name: newPresence.user?.tag || "", iconURL: newPresence.user?.displayAvatarURL() });

		if (
			!oldPresence?.activities?.every(
				(activity, index) => activity.type !== newPresence?.activities?.[index]?.type
			)
		) {
			embed.addField(
				"Activité",
				`${oldPresence?.activities?.[0]?.type} => ${newPresence?.activities?.[0]?.type}`
			);
		}

		loggingChannel.send({ embeds: [embed] });
	}
};

module.exports = presenceUpdate;
