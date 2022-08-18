import { PermissionString } from "discord.js";

export const permissionToName = (permission: PermissionString) => {
	switch (permission) {
		case "CREATE_INSTANT_INVITE":
			return "Créer une invitation instantanée";
		case "KICK_MEMBERS":
			return "Expulser des membres";
		case "BAN_MEMBERS":
			return "Bannir des membres";
		case "ADMINISTRATOR":
			return "Administrateur";
		case "MANAGE_CHANNELS":
			return "Gérer les salons";
		case "MANAGE_GUILD":
			return "Gérer le serveur";
		case "ADD_REACTIONS":
			return "Ajouter des réactions";
		case "VIEW_AUDIT_LOG":
			return "Voir le journal d'audit";
		case "PRIORITY_SPEAKER":
			return "Parler en priorité";
		case "STREAM":
			return "Stream";
		case "VIEW_CHANNEL":
			return "Voir le salon";
		case "SEND_MESSAGES":
			return "Envoyer des messages";
		case "SEND_TTS_MESSAGES":
			return "Envoyer des messages TTS";
		case "MANAGE_MESSAGES":
			return "Gérer les messages";
		case "EMBED_LINKS":
			return "Liens intégrés";
		case "ATTACH_FILES":
			return "Joindre des fichiers";
		case "READ_MESSAGE_HISTORY":
			return "Lire l'historique des messages";
		case "MENTION_EVERYONE":
			return "Mentionner tout le monde";
		case "USE_EXTERNAL_EMOJIS":
			return "Utiliser des emojis externes";
		case "VIEW_GUILD_INSIGHTS":
			return "Voir les analyses du serveur";
		case "CONNECT":
			return "Se connecter";
		case "SPEAK":
			return "Parler";
		case "MUTE_MEMBERS":
			return "Rendre muet les membres";
		case "DEAFEN_MEMBERS":
			return "Rendre sourd les membres";
		case "MOVE_MEMBERS":
			return "Déplacer les membres";
		case "USE_VAD":
			return "Utiliser la voix activée";
		case "CHANGE_NICKNAME":
			return "Changer le pseudo";
		case "MANAGE_NICKNAMES":
			return "Gérer les pseudos";
		case "MANAGE_ROLES":
			return "Gérer les rôles";
		case "MANAGE_WEBHOOKS":
			return "Gérer les webhooks";
		case "MANAGE_EMOJIS_AND_STICKERS":
			return "Gérer les emojis et les stickers";
		case "USE_APPLICATION_COMMANDS":
			return "Utiliser les commandes d'application";
		case "REQUEST_TO_SPEAK":
			return "Demander de parler";
		case "MANAGE_THREADS":
			return "Gérer les discussions";
		case "USE_PUBLIC_THREADS":
			return "Utiliser les discussions publiques";
		case "CREATE_PUBLIC_THREADS":
			return "Créer des discussions publiques";
		case "USE_PRIVATE_THREADS":
			return "Utiliser les discussions privées";
		case "CREATE_PRIVATE_THREADS":
			return "Créer des discussions privées";
		case "USE_EXTERNAL_STICKERS":
			return "Utiliser les stickers externes";
		case "SEND_MESSAGES_IN_THREADS":
			return "Envoyer des messages dans les discussions";
		case "START_EMBEDDED_ACTIVITIES":
			return "Démarrer des activités intégrées";
		case "MODERATE_MEMBERS":
			return "Modérer les membres";
		case "MANAGE_EVENTS":
			return "Gérer les événements";
	}

	return "Inconnu";
};
