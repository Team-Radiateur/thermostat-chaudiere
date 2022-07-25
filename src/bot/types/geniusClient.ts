import Genius from "genius-lyrics";

import { env } from "../../../config/env";

export default class GeniusClient {
	private static instance: Genius.Client;

	static getInstance(): Genius.Client {
		if (!this.instance) {
			this.instance = new Genius.Client(env.external.api.genius);
		}

		return this.instance;
	}
}
