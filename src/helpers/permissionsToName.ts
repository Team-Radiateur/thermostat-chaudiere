import { PermissionsString } from "discord.js";

export const permissionToName = (permission: PermissionsString) => {
	switch (permission) {
		case "CreateInstantInvite":
			return "Créer une invitation instantanée";
		case "KickMembers":
			return "Expulser des membres";
		case "BanMembers":
			return "Bannir des membres";
		case "Administrator":
			return "Administrateur";
		case "ManageChannels":
			return "Gérer les salons";
		case "ManageGuild":
			return "Gérer le serveur";
		case "AddReactions":
			return "Ajouter des réactions";
		case "ViewAuditLog":
			return "Voir le journal d'audit";
		case "PrioritySpeaker":
			return "Parler en priorité";
		case "Stream":
			return "Stream";
		case "ViewChannel":
			return "Voir le salon";
		case "SendMessages":
			return "Envoyer des messages";
		case "SendTTSMessages":
			return "Envoyer des messages TTS";
		case "ManageMessages":
			return "Gérer les messages";
		case "EmbedLinks":
			return "Liens intégrés";
		case "AttachFiles":
			return "Joindre des fichiers";
		case "ReadMessageHistory":
			return "Lire l'historique des messages";
		case "MentionEveryone":
			return "Mentionner tout le monde";
		case "UseExternalEmojis":
			return "Utiliser des emojis externes";
		case "ViewGuildInsights":
			return "Voir les analyses du serveur";
		case "Connect":
			return "Se connecter";
		case "Speak":
			return "Parler";
		case "MuteMembers":
			return "Rendre muet les membres";
		case "DeafenMembers":
			return "Rendre sourd les membres";
		case "MoveMembers":
			return "Déplacer les membres";
		case "UseVAD":
			return "Utiliser la voix activée";
		case "ChangeNickname":
			return "Changer le pseudo";
		case "ManageNicknames":
			return "Gérer les pseudos";
		case "ManageRoles":
			return "Gérer les rôles";
		case "ManageWebhooks":
			return "Gérer les webhooks";
		case "ManageEmojisAndStickers":
			return "Gérer les emojis et les stickers";
		case "UseApplicationCommands":
			return "Utiliser les commandes d'application";
		case "RequestToSpeak":
			return "Demander de parler";
		case "ManageThreads":
			return "Gérer les discussions";
		case "ManageEvents":
			return "Gérer les évènements";
		case "ModerateMembers":
			return "Modérer les membres";
		case "CreatePublicThreads":
			return "Créer des discussions publiques";
		case "CreatePrivateThreads":
			return "Créer des discussions privées";
		case "UseExternalStickers":
			return "Utiliser les stickers externes";
		case "SendMessagesInThreads":
			return "Envoyer des messages dans les discussions";
		case "UseEmbeddedActivities":
			return "Démarrer des activités intégrées";
	}

	return "Inconnu";
};
