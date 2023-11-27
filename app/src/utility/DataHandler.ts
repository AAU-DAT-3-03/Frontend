import Networking from './Networking';
import { LoginBody } from './DataHandlerTypes';
class DataHandler {
	private static ip: string = 'http://10.92.0.231';
	private static dataArchive: Map<string, object> = new Map();

	public static async login(email: string, password: string): Promise<void> {
		let networkHandler: Networking = new Networking();
		let settings: LoginBody = {
			email: email,
			password: password
		};

		networkHandler.post(
			DataHandler.ip,
			{
				body: settings
			},
			(value): void => {
				if (value) {
					console.log(value);
				}
			}
		);
	}
}

export default DataHandler;
