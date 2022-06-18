import { User } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";

import { DiscordEvent } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";
import { env } from "../../../config/env";
import { prepareEmbed } from "../../helpers/macros";

const userUpdate: DiscordEvent = {
	name: "userUpdate",
	once: false,
	execute: async (oldUser: User, newUser: User) => {
		if (oldUser.bot) return;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(env.bot.userUpdateLoggingChannel);
		if (!loggingChannel || !loggingChannel.isText()) return;
		const embed = prepareEmbed(oldUser)
			.setTitle("Valve thermostatique événementielle")
			.setDescription(bold(`${oldUser.tag} a mis à jour son profil !`))
			.setFooter({ text: `ID de l'utilisateur: ${newUser.id}` });

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			embed.addField(
				"Avatar",
				`${hyperlink("[précédent]", oldUser.displayAvatarURL())} => ${hyperlink(
					"[nouveau]",
					newUser.displayAvatarURL()
				)}`
			);
		} else if (oldUser.username !== newUser.username) {
			embed.addField("Nouveau pseudo", `${oldUser.username} => ${newUser.username}`);
		} else if (oldUser.discriminator !== newUser.discriminator) {
			embed.addField("Nouveau discriminant", `${oldUser.discriminator} => ${newUser.discriminator}`);
		} else if (oldUser.tag !== newUser.tag) {
			embed.addField("Nouveau tag", newUser.tag);
		} else {
			return;
		}

		await loggingChannel.send({ embeds: [embed] });
	}
};

module.exports = userUpdate;
