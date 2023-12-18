import Networking from './Networking';
import {
	AuthResponse,
	CompanyData,
	CompanyResponse,
	IncidentResponse,
	LoginBody,
	MergeIncident,
	NotificationBody,
	ServerResponse,
	ServicesResponse,
	UpdateIncident,
	UserResponse
} from './DataHandlerTypes';
import LocalStorage from './LocalStorage';
import { IncidentState } from '../components/StatusIcon';
import Logger from './Logger';
import NotificationHandler from './NotificationHandler';

const longDataCacheTime: number = 300000;
const shortDataCacheTime: number = 5000;

class DataHandler {
	public static readonly ip: string = 'http://10.92.0.231/';
	private static users: [number, Map<string, UserResponse>] = [0, new Map<string, UserResponse>()];
	private static companies: [number, Map<string, CompanyData>] = [0, new Map<string, CompanyData>()];
	private static services: [number, Map<string, ServicesResponse>] = [0, new Map<string, ServicesResponse>()];
	private static activeIncidents: [number, Map<string, IncidentResponse>] = [0, new Map<string, IncidentResponse>()];
	private static resolvedIncidents: [number, Map<string, IncidentResponse>] = [0, new Map<string, IncidentResponse>()];
	private static logger: Logger = new Logger('DataHandler');
	private static notificationRegistered: boolean = false;

	public static async registerNotification(token: string | null): Promise<boolean> {
		if (DataHandler.notificationRegistered && token !== null) return true;
		let networking: Networking = new Networking();
		let body: NotificationBody = {
			registrationToken: token
		};
		let promise: Promise<boolean> = new Promise((resolve): void => {
			networking.post(DataHandler.ip + 'notification', { body: body }, (value: void | [object, Response]): void => {
				if (value) {
					let response: { statusCode: number; msg: string } = JSON.parse(JSON.stringify(value[0]));
					if (response.statusCode === 0) {
						this.logger.info('Successfully set notification token');
						if (token === null) {
							NotificationHandler.registered = false;
							DataHandler.notificationRegistered = false;
						} else {
							DataHandler.notificationRegistered = true;
						}
						resolve(true);
						return;
					}
					resolve(false);
					return;
				}
				resolve(false);
			});
		});
		return promise;
	}

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

	private static async createIncidentMap(value: [Object, Response]): Promise<Map<string, IncidentResponse>> {
		let response: ServerResponse<IncidentResponse[]> = JSON.parse(JSON.stringify(value[0]));
		let incidentMap: Map<string, IncidentResponse> = new Map<string, IncidentResponse>();

		response.msg.forEach((value: IncidentResponse): void => {
			incidentMap.set(value.id, value);
		});
		return incidentMap;
	}

	private static async createIncidentMapFromArray(value: IncidentResponse[]): Promise<Map<string, IncidentResponse>> {
		let incidentMap: Map<string, IncidentResponse> = new Map<string, IncidentResponse>();

		value.forEach((value: IncidentResponse): void => {
			incidentMap.set(value.id, value);
		});
		return incidentMap;
	}

	public static async getIncidentsDataMap(): Promise<Map<string, IncidentResponse>> {
		await this.getIncidentsData();
		return this.activeIncidents[1];
	}

	private static async getAllIncidentsData(params: string): Promise<Map<string, IncidentResponse>> {
		let networkHandler: Networking = new Networking();
		let incidentPromise: Promise<IncidentResponse[]> = new Promise((resolve): void => {
			networkHandler.get(
				DataHandler.ip + `incidents${params}`,
				undefined,
				async (value: void | [object, Response]): Promise<void> => {
					if (value) {
						let response: ServerResponse<IncidentResponse[]> = JSON.parse(JSON.stringify(value[0]));
						resolve(response.msg);
					}
					resolve([]);
				}
			);
		});
		let servicePromise: Promise<Map<string, ServicesResponse>> = new Promise(async (resolve): Promise<void> => {
			resolve(await this.getServicesMap());
		});

		return new Promise<Map<string, IncidentResponse>>((resolve) =>
			Promise.all([incidentPromise, servicePromise]).then(
				async (value: [IncidentResponse[], Map<string, ServicesResponse>]): Promise<void> => {
					let incidents: IncidentResponse[] = value[0];
					let services: Map<string, ServicesResponse> = value[1];
					for (let i = incidents.length - 1; i >= 0; i--) {
						for (let j = incidents[i].alarms.length - 1; j >= 0; j--) {
							let serviceName: string = services.get(incidents[i].alarms[j].serviceId)?.name ?? '';
							incidents[i].alarms[j].serviceName = serviceName;
						}
					}
					let incidentMap: Map<string, IncidentResponse> = await this.createIncidentMapFromArray(incidents);
					resolve(incidentMap);
				}
			)
		);
	}

	public static async getIncidentsData(): Promise<IncidentResponse[]> {
		if (Date.now() - this.activeIncidents[0] > shortDataCacheTime || this.activeIncidents[1].size === 0) {
			let incidents: Map<string, IncidentResponse> = await DataHandler.getAllIncidentsData('?resolved=false');
			this.activeIncidents = [Date.now(), incidents];
		}

		return Array.from(this.activeIncidents[1].values());
	}

	public static async getResolvedIncidentsData(start: number, end: number): Promise<IncidentResponse[]> {
		if (Date.now() - this.resolvedIncidents[0] > shortDataCacheTime || this.resolvedIncidents[1].size === 0) {
			let incidents: Map<string, IncidentResponse> = await DataHandler.getAllIncidentsData(
				`?resolved=true&start=${start}&end=${end}`
			);
			this.resolvedIncidents = [Date.now(), incidents];
		}

		return Array.from(this.resolvedIncidents[1].values());
	}

	public static async getIncidentResponse(id: string): Promise<IncidentResponse | undefined> {
		if (Date.now() - this.activeIncidents[0] > shortDataCacheTime || this.activeIncidents[1].size === 0) {
			let data: IncidentResponse | undefined = this.activeIncidents[1].get(id);
			if (data !== undefined) return data;
		}

		this.logger.info(`Getting a single incident with id: ${id}`);
		let incidents: Map<string, IncidentResponse> = await DataHandler.getAllIncidentsData(`?id=${id}`);
		let incidentData: IncidentResponse | undefined = incidents.get(id);
		if (incidentData !== undefined) {
			this.logger.info(`Data received for incident: ${id}`);
			this.activeIncidents[1].set(incidentData.id, incidentData);
		}
		return incidentData;
	}

	public static async updateIncidentResponse(data: UpdateIncident): Promise<void> {
		let networkHandler: Networking = new Networking();
		return await new Promise((resolve): void => {
			networkHandler.put(
				DataHandler.ip + 'incidents',
				{
					body: data
				},
				(value: void | [object, Response]): void => {
					if (value) {
						this.logger.info(value[0]);
					} else {
						this.logger.warn(`${data.id} - Got nothing back`);
					}
					resolve();
				}
			);
		});
	}

	public static getIncidentResponseNoUpdate(): Map<string, IncidentResponse> {
		return this.activeIncidents[1];
	}

	public static async getAlarmData(id: string) {
		let networkHandler: Networking = new Networking();
		networkHandler.get(DataHandler.ip + `alarm?id=${id}`);
	}

	public static async auth(): Promise<boolean> {
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'auth', undefined, (value: void | [object, Response]): void => {
				if (value) {
					let response: ServerResponse<AuthResponse> = JSON.parse(JSON.stringify(value[0]));
					LocalStorage.setSettingsValue('username', response.msg.name);
					LocalStorage.setSettingsValue('phoneNr', response.msg.phoneNumber);
					LocalStorage.setSettingsValue('id', response.msg.id);
					LocalStorage.setSettingsValue('email', response.msg.email);
					resolve(true);
					return;
				}
				resolve(false);
			});
		});
	}

	public static async login(email: string, password: string): Promise<[boolean, object]> {
		let networkHandler: Networking = new Networking();
		let settings: LoginBody = {
			email: email,
			password: password
		};

		return new Promise((resolve): void => {
			networkHandler.post(
				DataHandler.ip + 'login',
				{
					body: settings,
					sendAuthKey: false
				},
				async (value: void | [object, Response]): Promise<void> => {
					if (value) {
						let response: Response = value[1];
						let cookies: Map<string, string> | undefined = this.getCookiesMap(response);
						if (cookies === undefined) {
							resolve([false, value]);
							return;
						}
						let token: string | undefined = cookies.get('authToken');
						if (token === undefined) {
							resolve([false, value]);
							return;
						}
						LocalStorage.setSettingsValue('authKey', token);
						await this.auth();
						resolve([true, value]);
					}
					resolve([false, {}]);
				}
			);
		});
	}

	public static async getUser(id: string): Promise<UserResponse | undefined> {
		await this.getUsers();
		return this.users[1].get(id);
	}

	public static async getUsersMap(): Promise<Map<string, UserResponse>> {
		await this.getUsers();
		return this.users[1];
	}

	public static async getUsers(): Promise<UserResponse[]> {
		if (Date.now() - this.users[0] < longDataCacheTime && this.users[1].size > 0) return Array.from(this.users[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'users?id=*', undefined, (value: void | [object, Response]): void => {
				if (value) {
					this.logger.info('Loaded user data');
					let users: ServerResponse<UserResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let usersMap: Map<string, UserResponse> = new Map<string, UserResponse>();
					users.msg.forEach((value: UserResponse): void => {
						usersMap.set(value.id, value);
					});
					this.users = [Date.now(), usersMap];
					resolve(users.msg);
					return;
				}
				resolve([]);
			});
		});
	}

	private static async getServicesMap(): Promise<Map<string, ServicesResponse>> {
		await this.getServicesData();
		return this.services[1];
	}

	private static async getServicesData(): Promise<ServicesResponse[]> {
		if (Date.now() - this.services[0] < longDataCacheTime && this.services[1].size > 0) return Array.from(this.services[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'services?id=*', undefined, (value: void | [object, Response]): void => {
				if (value) {
					this.logger.info('Loaded user data');
					let services: ServerResponse<ServicesResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let servicesMap: Map<string, ServicesResponse> = new Map<string, ServicesResponse>();
					services.msg.forEach((value: ServicesResponse): void => {
						servicesMap.set(value.id, value);
					});
					this.services = [Date.now(), servicesMap];
					resolve(services.msg);
					return;
				}
				resolve([]);
			});
		});
	}

	public static async getCompaniesMap(): Promise<Map<string, CompanyData>> {
		await this.getCompanies();
		return this.companies[1];
	}

	public static async getCompany(id: string): Promise<CompanyData | undefined> {
		await this.getCompanies();
		return this.companies[1].get(id);
	}

	private static async getCompanyData(): Promise<CompanyResponse[]> {
		if (Date.now() - this.companies[0] < longDataCacheTime && this.companies[1].size > 0) return Array.from(this.companies[1].values());

		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'companies?id=*', undefined, async (value: void | [object, Response]): Promise<void> => {
				if (value) {
					let companies: ServerResponse<CompanyResponse[]> = JSON.parse(JSON.stringify(value[0]));
					resolve(companies.msg);
				}
				resolve([]);
			});
		});
	}

	public static async getCompanies(): Promise<CompanyData[]> {
		if (Date.now() - this.companies[0] < shortDataCacheTime && this.companies[1].size > 0)
			return Array.from(this.companies[1].values());

		let companies: CompanyResponse[] = [];
		let incidentData: IncidentResponse[] = [];
		let companiesPromise: Promise<void> = new Promise(async (resolve): Promise<void> => {
			companies = await this.getCompanyData();
			resolve();
		});
		let incidentDataPromise: Promise<void> = new Promise(async (resolve): Promise<void> => {
			incidentData = await this.getIncidentsData();
			resolve();
		});

		await Promise.all([companiesPromise, incidentDataPromise]);

		if (companies.length === 0) return [];
		let companiesData: Map<string, CompanyData> = new Map<string, CompanyData>();
		for (let i = 0; i < companies.length; i++) {
			let priority: number = 5;
			let state: IncidentState = 'none';
			let secondaryState: IncidentState = 'none';
			let stateFound: boolean = false;
			let incidentReferences: string[] = [];
			for (let incidentsKey in incidentData) {
				let incident: IncidentResponse = incidentData[incidentsKey];

				if (incident.companyPublic.id !== companies[i].id) continue;
				incidentReferences.push(incident.id);
				if (priority > incident.priority) priority = incident.priority;
				if (stateFound) continue;

				let incidentResolved: boolean = incident.resolved;
				let incidentAcknowledged: boolean = incident.users.length > 0;
				let incidentError: boolean = !incidentAcknowledged && !incidentResolved;

				if (incidentAcknowledged && state === 'error') {
					secondaryState = 'acknowledged';
					stateFound = true;
					continue;
				}

				if (incidentError || state === 'error') {
					if (state === 'acknowledged') {
						secondaryState = 'acknowledged';
						stateFound = true;
					}
					state = 'error';
					continue;
				}

				if (incidentAcknowledged) state = 'acknowledged';
				if (incidentResolved && !incidentAcknowledged) state = 'resolved';
			}
			companiesData.set(companies[i].id, {
				id: companies[i].id,
				state: state,
				name: companies[i].name,
				secondaryState: secondaryState,
				priority: priority === 5 ? -1 : priority,
				incidentReferences: incidentReferences
			});
		}
		this.companies = [Date.now(), companiesData];
		return Array.from(companiesData.values());
	}

	public static async mergeIncidents(first: string, second: string): Promise<IncidentResponse | undefined> {
		let networking: Networking = new Networking();
		let body: MergeIncident = {
			first: first,
			second: second
		};
		return new Promise((resolve): void => {
			networking.post(DataHandler.ip + 'merge', { body: body }, (value: void | [object, Response]): void => {
				if (value) {
					let data: ServerResponse<IncidentResponse> = JSON.parse(JSON.stringify(value[0]));
					if (data.statusCode === 200 || data.statusCode === 0) {
						resolve(data.msg);
						return;
					}
				}
				resolve(undefined);
			});
		});
	}
}

export default DataHandler;
