import Networking from './Networking';
import { LoginBody } from './DataHandlerTypes';
import LocalStorage from './LocalStorage';
class DataHandler {
	private static ip: string = 'http://10.92.0.231/';
	private static dataArchive: Map<string, object> = new Map();

	public static getCookiesMap(response: Response): Map<string, string> | undefined {
		if (!response.headers.has('set-cookie')) return undefined;

		let setCookie: string | null = response.headers.get('set-cookie');
		if (setCookie === null) {
			return undefined;
		}
		let cookiesSplit: string[] = setCookie?.split(';');
		let cookies: Map<string, string> = new Map<string, string>();
		for (let cookie of cookiesSplit) {
			let keyValue: string[] = cookie.split('=', 2);
			if (keyValue.length < 2) {
				cookies.set(keyValue[0], '');
				continue;
			}
			cookies.set(keyValue[0], keyValue[1]);
		}
		return cookies;
	}

	public static async login(email: string, password: string): Promise<boolean> {
		let networkHandler: Networking = new Networking();
		let settings: LoginBody = {
			email: email,
			password: password
		};

		return new Promise((resolve) => {
			networkHandler.post(
				DataHandler.ip + 'login',
				{
					body: settings
				},
				(value): void => {
					if (value) {
						let response: Response = value[1];
						let cookies: Map<string, string> | undefined = this.getCookiesMap(response);
						if (cookies === undefined) {
							resolve(false);
							return;
						}
						let token: string | undefined = cookies.get('authToken');
						if (token === undefined) {
							resolve(false);
							return;
						}
						LocalStorage.setSettingsValue('authKey', token);
						resolve(true);
					}
					resolve(false);
				}
			);
		});
	}
}

export default DataHandler;
