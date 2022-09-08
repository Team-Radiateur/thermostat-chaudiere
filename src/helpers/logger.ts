import * as fs from "fs/promises";
import { ColoredConsoleSink, LogEvent, LogEventLevel, LoggerConfiguration, Sink } from "serilogger";

import { one_Go } from "./file";

const DIR_PATH = `${__dirname}/../../../logs`;

class FileSink implements Sink {
	#name: string;
	readonly #level: LogEventLevel;
	readonly #dirpath: string;

	constructor(name = new Date().toISOString().split("T")[0], level = LogEventLevel.verbose, dirpath = DIR_PATH) {
		this.#name = name;
		this.#level = level;
		this.#dirpath = dirpath;
	}

	get fullname(): string {
		const extension = LogEventLevel[this.#level];
		return `${this.#name}-${extension}`;
	}

	get filePath(): string {
		return `${this.#dirpath}/${this.fullname}.log`;
	}

	async #manageFile(): Promise<void> {
		if (/\d{4}-|d{2}-\d{2}/.test(this.#name)) {
			const [potentialNewFileName] = new Date().toISOString().split("T");

			if (potentialNewFileName !== this.#name) {
				this.#name = potentialNewFileName;
			}
		}

		try {
			await fs.access(this.filePath);
		} catch (error) {
			await fs.writeFile(this.filePath, "", { encoding: "utf-8" });
		}

		const fileStats = await fs.stat(this.filePath);

		if (fileStats.size > one_Go) {
			const files = await fs.readdir(this.#dirpath);
			const todayFilesNumber = files.filter(name => name.includes(this.fullname)).length;

			try {
				await fs.rename(this.filePath, `${this.filePath}.${todayFilesNumber}`);
			} catch (_error) {
				// File already renamed, we don't care
			} finally {
				await fs.writeFile(this.filePath, "", { encoding: "utf-8" });
			}
		}
	}

	async emit(events: LogEvent[]): Promise<void> {
		if (this.#level === LogEventLevel.off) return;

		await this.#manageFile();

		for (const event of events) {
			if (this.#level === LogEventLevel.verbose || this.#level === event.level) {
				await fs.appendFile(
					this.filePath,
					`[${LogEventLevel[event.level]}] ${event.messageTemplate.render()}\n`
				);
			}
		}
	}

	flush(): Promise<undefined> {
		return Promise.resolve(undefined);
	}
}

const log = new LoggerConfiguration()
	.minLevel(LogEventLevel.verbose)
	.writeTo(new ColoredConsoleSink())
	.writeTo(new FileSink())
	.writeTo(new FileSink(undefined, LogEventLevel.error))
	.create();

function readableNow() {
	return `${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`;
}

function loggerDebug(text: string): void {
	log.debug(`${readableNow()} | ${text}`);
}

function loggerInfo(text: string): void {
	log.info(`${readableNow()} | ${text}`);
}

function loggerWarning(text: string): void {
	log.warn(`${readableNow()} | ${text}`);
}

function loggerError(text: string): void {
	log.error(`${readableNow()} ${text}`);
}

export const logger = {
	info: loggerInfo,
	debug: loggerDebug,
	warning: loggerWarning,
	error: loggerError
};
