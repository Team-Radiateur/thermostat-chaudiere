import { Client } from "genius-lyrics";

import { env } from "../../../config/env";

export default class GeniusClient {
	private static instance: Client;

	static getInstance(): Client {
		if (!this.instance) {
			this.instance = new Client(env.external.api.genius);
		}

		return this.instance;
	}
}
