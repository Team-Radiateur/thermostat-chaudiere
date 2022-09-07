import { Locale } from "discord-api-types/v10";
import * as fs from "fs/promises";
import { ColoredConsoleSink, LogEvent, LogEventLevel, LoggerConfiguration, Sink } from "serilogger";

const DIR_PATH = `${__dirname}/../../../logs`;

class FileSink implements Sink {
	#name: string;
	readonly #level: LogEventLevel;
	readonly #dirpath: string;

	constructor(
		name = new Date().toLocaleDateString(Locale.French, {
			weekday: "long",
			year: "numeric",
			day: "numeric",
			month: "long"
		}),
		level = LogEventLevel.verbose,
		dirpath = DIR_PATH
	) {
		this.#name = name;
		this.#level = level;
		this.#dirpath = dirpath;

		fs.access(dirpath)
			.catch(async () => {
				await fs.mkdir(dirpath);
			})
			.finally(() => {
				fs.access(this.filePath()).catch(async () => {
					await fs.writeFile(this.filePath(), "");
				});
			});
	}

	public filePath(): string {
		const extension = LogEventLevel[this.#level];
		return `${this.#dirpath}/${this.#name}-${extension}.log`;
	}

	async emit(events: LogEvent[]): Promise<void> {
		if (this.#level === LogEventLevel.off) return;

		if (/[a-z]+\s\d{1,2}\s[a-z]+\s\d{4}/.test(this.#name)) {
			const potentialNewFileName = new Date().toLocaleDateString(Locale.French, {
				weekday: "long",
				year: "numeric",
				day: "numeric",
				month: "long"
			});

			if (potentialNewFileName !== this.#name) {
				this.#name = potentialNewFileName;

				await fs.writeFile(this.filePath(), "");
			}
		}

		for (const event of events) {
			if (this.#level === LogEventLevel.verbose || this.#level === event.level) {
				await fs.appendFile(
					this.filePath(),
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
