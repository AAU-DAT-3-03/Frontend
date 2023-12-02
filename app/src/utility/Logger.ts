class Logger {
	private static devMode = true;
	private readonly tag: string;
	constructor(tag: string) {
		this.tag = tag;
	}

	private dateFormatter(): string {
		return new Date(Date.now()).toLocaleDateString([], { hour: '2-digit', minute: '2-digit', hour12: false, dateStyle: 'short' });
	}

	private logFormat(severity: string, ...msg: any[]): string {
		return `[${severity}][${this.dateFormatter()}][${this.tag}] ${msg.join(', ')}`;
	}

	public info(...msg: any[]) {
		if (Logger.devMode) {
			console.info(this.logFormat('INFO', msg));
		}
	}

	public warn(...msg: any[]) {
		if (Logger.devMode) {
			console.warn(this.logFormat('WARN', msg));
		}
	}

	public error(...msg: any[]) {
		if (Logger.devMode) {
			console.error(this.logFormat('ERROR', msg));
		}
	}
}

export default Logger;
