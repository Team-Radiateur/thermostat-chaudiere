import * as fs from "fs";
import * as fsp from "fs/promises";
import { ColoredConsoleSink, LogEvent, LogEventLevel, LoggerConfiguration, Sink } from "serilogger";

import { one_MB } from "./fileSize";

const DIR_PATH = `${__dirname}/../../../logs`;

export interface FileSinkOptions {
	fileName?: string;
	outputDir?: string;
	logEventLevel?: LogEventLevel;
	maxFileSize?: number;
}

class FileSink implements Sink {
	#name: string;
	#newFile: boolean;
	readonly #level: LogEventLevel;
	readonly #outputDir: string;
	readonly #maxFileSize: number;
	readonly #content: string[];

	constructor({ fileName, outputDir, logEventLevel, maxFileSize }: FileSinkOptions) {
		this.#name = fileName || new Date().toISOString().split("T")[0];
		this.#level = logEventLevel || LogEventLevel.verbose;
		this.#outputDir = outputDir || "./logs";
		this.#maxFileSize = maxFileSize || one_MB * 10;
		this.#content = [];
		this.#newFile = true;
	}

	get fullname(): string {
		const extension = LogEventLevel[this.#level];
		return `${this.#name}-${extension}`;
	}

	get filePath(): string {
		return `${this.#outputDir}/${this.fullname}.log`;
	}

	async #manageFiles(): Promise<void> {
		this.#renameInCaseDateChanged();
		await this.#checkFileExists();
		const fileStats = await fsp.stat(this.filePath);

		if (fileStats.size > this.#maxFileSize) {
			await this.#rollFile();
		}
	}

	#countNumberOfLogFile(files: string[]): number {
		return files.filter(name => name.includes(this.fullname)).length;
	}

	async #rollFile(): Promise<void> {
		try {
			const files = await fsp.readdir(this.#outputDir);
			const todayFilesNumber = this.#countNumberOfLogFile(files);

			await fsp.rename(this.filePath, `${this.filePath}.${todayFilesNumber}`);
		} catch (_error) {
			// File already renamed, we don't care
		} finally {
			await this.#checkFileExists();
		}
	}

	async #checkFileExists() {
		if (!fs.existsSync(this.filePath)) {
			await fsp.writeFile(this.filePath, "", { encoding: "utf-8" });
			this.#newFile = true;
		} else {
			this.#newFile = false;
		}
	}

	#renameInCaseDateChanged() {
		if (/\d{4}-\d{2}-\d{2}/.test(this.#name)) {
			const [potentialNewFileName] = new Date().toISOString().split("T");

			if (potentialNewFileName !== this.#name) {
				this.#name = potentialNewFileName;
			}
		}
	}

	async emit(events: LogEvent[]): Promise<void> {
		if (this.#level === LogEventLevel.off) return;

		await this.#manageFiles();

		for (const event of events) {
			if (this.#level === LogEventLevel.verbose || this.#level === event.level) {
				this.#content.push(`[${LogEventLevel[event.level]}] ${event.messageTemplate.render()}`);
			}
		}

		await this.flush();
	}

	async flush(): Promise<void> {
		await fsp.appendFile(this.filePath, `${this.#newFile ? "" : "\n"}${this.#content.join("\n")}`, {
			encoding: "utf-8"
		});

		this.#content.length = 0;
	}
}

const log = new LoggerConfiguration()
	.writeTo(new ColoredConsoleSink())
	.writeTo(
		new FileSink({
			outputDir: DIR_PATH,
			logEventLevel: LogEventLevel.verbose
		})
	)
	.writeTo(
		new FileSink({
			outputDir: DIR_PATH,
			logEventLevel: LogEventLevel.error
		})
	)
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
	log.error(`${readableNow()} | ${text}`);
}

export const logger = {
	info: loggerInfo,
	debug: loggerDebug,
	warning: loggerWarning,
	error: loggerError
};
