import { DiscordEvent } from "../types/discordEvents";
import { MessageEmbed, User } from "discord.js";
import { DiscordClient } from "../types/discordClient";
import { env } from "../../../config/env";
import { hyperlink, userMention } from "@discordjs/builders";

const userUpdate: DiscordEvent = {
	name: "userUpdate",
	once: false,
	execute: async (oldUser: User, newUser: User) => {
		if (oldUser.bot) return;

		const loggingChannel = DiscordClient.getInstance().channels.cache.get(env.bot.userUpdateLoggingChannel);
		if (!loggingChannel || !loggingChannel.isText()) return;
		let embed = new MessageEmbed()
			.setTitle(`${userMention(oldUser.id)} a mis à jour son profil !`)
			.setColor("#00ffff");

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
			embed = embed.addField("Nouveau pseudo", newUser.username);
		} else if (oldUser.discriminator !== newUser.discriminator) {
			embed = embed.addField("Nouveau discriminant", newUser.discriminator);
		} else if (oldUser.tag !== newUser.tag) {
			embed = embed.addField("Nouveau tag", newUser.tag);
		}

		await loggingChannel.send(embed.toString());
	}
};

module.exports = userUpdate;
