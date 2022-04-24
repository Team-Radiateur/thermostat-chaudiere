import { MessageEmbed, User } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";

import { DiscordEvent } from "../types/discordEvents";
import { DiscordClient } from "../types/discordClient";
import { env } from "../../../config/env";

const userUpdate: DiscordEvent = {
	name: "userUpdate",
	once: false,
	execute: async (oldUser: User, newUser: User) => {
		if (oldUser.bot) return;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(env.bot.userUpdateLoggingChannel);
		if (!loggingChannel || !loggingChannel.isText()) return;
		let embed = new MessageEmbed()
			.setTitle(bold(`${oldUser.tag} a mis à jour son profil !`))
			.setColor("#00ffff")
			.setAuthor({ name: oldUser.tag, iconURL: oldUser.displayAvatarURL() })
			.setFooter({ text: `ID de l'utilisateur: ${newUser.id} • ${new Date().toLocaleString()}` });

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			// eslint-disable-next-line max-len
			embed = embed.addField(
				"Avatar",
				`${hyperlink("[précédent]", oldUser.displayAvatarURL())} => ${hyperlink(
					"[nouveau]",
					newUser.displayAvatarURL()
				)}`
			);
		} else if (oldUser.username !== newUser.username) {
			embed = embed.addField("Nouveau pseudo", `${oldUser.username} => ${newUser.username}`);
		} else if (oldUser.discriminator !== newUser.discriminator) {
			embed = embed.addField("Nouveau discriminant", `${oldUser.discriminator} => ${newUser.discriminator}`);
		} else if (oldUser.tag !== newUser.tag) {
			embed = embed.addField("Nouveau tag", newUser.tag);
		} else {
			return;
		}

		await loggingChannel.send({ embeds: [embed] });
	}
};

module.exports = userUpdate;
