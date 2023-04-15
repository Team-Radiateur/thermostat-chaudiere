export function msToTime(duration: number): string {
	const seconds = Math.floor((duration / 1000) % 60);
	const minutes = Math.floor((duration / 60000) % 60);
	const hours = Math.floor(duration / 3600000);
	const secondsPad = `${seconds}`.padStart(2, "0");
	const minutesPad = `${minutes}`.padStart(2, "0");
	const hoursPad = `${hours}`.padStart(2, "0");

	return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
}
