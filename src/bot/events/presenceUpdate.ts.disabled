import { Guild, Presence, User } from "discord.js";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";
import { DiscordClient } from "../types/discordClient";
import { DiscordEvent } from "../types/discordEvents";

const presenceUpdate: DiscordEvent = {
	name: "presenceUpdate",
	once: false,
	execute: async (oldPresence: Presence | undefined, newPresence: Presence) => {
		if (oldPresence?.user?.bot) return;
		if (newPresence?.user?.bot) return;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(
			env.bot.userUpdateLoggingChannelByGuild[(newPresence.guild as Guild).id]
		);
		if (!loggingChannel || !loggingChannel.isText()) return;

		const embed = prepareEmbed(oldPresence?.user || (newPresence?.user as User))
			.setTitle("Valve thermostatique des ressources humaines")
			.setDescription("Mise à jour du statut.");

		if (oldPresence?.status !== newPresence?.status) {
			embed.addField("Statut", `${oldPresence?.status} => ${newPresence?.status}`);
		} else {
			return;
		}

		loggingChannel.send({ embeds: [embed] });
	}
};

module.exports = presenceUpdate;
