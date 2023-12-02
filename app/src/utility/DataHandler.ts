import Networking from './Networking';
import {
	AuthResponse,
	CompanyData,
	CompanyResponse,
	IncidentData,
	IncidentResponse,
	LoginBody,
	MergeIncident,
	ServerResponse,
	ServicesResponse,
	UpdateIncident,
	UserResponse
} from './DataHandlerTypes';
import LocalStorage from './LocalStorage';
import { IncidentState } from '../components/StatusIcon';
import Logger from './Logger';
import companies from '../screens/Services/Companies';

const longDataCacheTime: number = 300000;
const shortDataCacheTime: number = 300000;

class DataHandler {
	private static ip: string = 'http://10.92.0.231/';
	private static users: [number, Map<string, UserResponse>] = [0, new Map<string, UserResponse>()];
	private static companies: [number, Map<string, CompanyData>] = [0, new Map<string, CompanyData>()];
	private static services: [number, Map<string, ServicesResponse>] = [0, new Map<string, ServicesResponse>()];
	private static activeIncidents: [number, Map<string, IncidentData>] = [0, new Map<string, IncidentData>()];
	private static resolvedIncidents: [number, Map<string, IncidentData>] = [0, new Map<string, IncidentData>()];
	private static logger: Logger = new Logger('DataHandler');
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

	private static async createIncidentMap(value: [Object, Response]): Promise<Map<string, IncidentData>> {
		let response: ServerResponse<IncidentResponse[]> = JSON.parse(JSON.stringify(value[0]));
		let incidentMap: Map<string, IncidentData> = new Map<string, IncidentData>();
		let companyMap: Map<string, string> = new Map<string, string>();
		let servicesMap: Map<string, string> = new Map<string, string>();

		let companyDataPromise: Promise<void> = new Promise(async (resolve) => {
			let companyData: CompanyResponse[] = await this.getCompanyData();
			companyData.forEach((value: CompanyResponse) => {
				companyMap.set(value.id, value.name);
			});
			resolve();
		});
		let servicesDataPromise: Promise<void> = new Promise(async (resolve) => {
			let servicesData: ServicesResponse[] = await this.getServicesData();
			servicesData.forEach((value: ServicesResponse) => {
				servicesMap.set(value.id, value.companyId);
			});
			resolve();
		});
		await Promise.all([servicesDataPromise, companyDataPromise]);

		response.msg.forEach((value: IncidentResponse): void => {
			let companyId: string = servicesMap.get(value.alarms.at(0)?.serviceId ?? '') ?? '';
			console.log(companyId, value.alarms.at(0)?.serviceId);
			incidentMap.set(value.id, { ...value, companyId: companyId, companyName: companyMap.get(companyId) ?? '' });
		});
		return incidentMap;
	}

	public static async getIncidentsData(): Promise<IncidentData[]> {
		if (Date.now() - this.activeIncidents[0] < 5000 && this.activeIncidents[1].size > 0)
			return Array.from(this.activeIncidents[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'incidents?resolved=false', undefined, async (value) => {
				if (value) {
					let incidentMap: Map<string, IncidentData> = await this.createIncidentMap(value);
					this.activeIncidents = [Date.now(), incidentMap];
					resolve(Array.from(incidentMap.values()));
				}
				resolve([]);
			});
		});
	}

	public static async getResolvedIncidentsData(start: number, end: number): Promise<IncidentData[]> {
		if (Date.now() - this.resolvedIncidents[0] < shortDataCacheTime && this.resolvedIncidents[1].size > 0)
			return Array.from(this.resolvedIncidents[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + `incidents?resolved=true&start=${start}&end=${end}`, undefined, async (value) => {
				if (value) {
					let incidentMap: Map<string, IncidentData> = await this.createIncidentMap(value);
					this.resolvedIncidents = [Date.now(), incidentMap];
					resolve(Array.from(incidentMap.values()));
				}
				resolve([]);
			});
		});
	}

	public static async getIncidentData(id: string): Promise<IncidentData | undefined> {
		if (Date.now() - this.activeIncidents[0] < shortDataCacheTime && this.activeIncidents[1].size > 0) {
			let data: IncidentData | undefined = this.activeIncidents[1].get(id);
			if (data !== undefined) return data;
		}
		this.logger.info('Loading a single incident with id: ${id}');
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + `incidents?id=${id}`, undefined, async (value) => {
				this.logger.info(`Got data from: incidents?id=${id}`);
				if (value) {
					let response: ServerResponse<IncidentResponse[]> = JSON.parse(JSON.stringify(value[0]));
					if (response.statusCode === 200 || response.statusCode === 0) {
						let companyData: CompanyResponse[] = (await this.getCompanyData()).filter(
							(value1: CompanyResponse): boolean => value1.id === response.msg[0].companyId
						);
						let companyName: string = companyData.at(0)?.name ?? '';
						let incidentData: IncidentData = { ...response.msg[0], companyName: companyName };
						this.activeIncidents[1].set(incidentData.id, incidentData);
						resolve(incidentData);
						return;
					}
				} else {
					this.logger.warn('Get single incident result: no data');
				}
				resolve(undefined);
			});
		});
	}

	public static async updateIncidentData(data: UpdateIncident): Promise<void> {
		let networkHandler: Networking = new Networking();
		networkHandler.put(
			DataHandler.ip + 'incidents',
			{
				body: data
			},
			(value) => {
				if (value) {
					this.logger.info(value[0]);
					return;
				}
				this.logger.warn(`${data.id} - Got nothing back`);
			}
		);
	}

	public static async getAlarmData(id: string) {
		let networkHandler: Networking = new Networking();
		networkHandler.get(DataHandler.ip + '');
	}

	public static async auth(): Promise<boolean> {
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			networkHandler.get(DataHandler.ip + 'auth', undefined, (value) => {
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
					body: settings,
					sendAuthKey: false
				},
				async (value): Promise<void> => {
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
						await this.auth();
						resolve(true);
					}
					resolve(false);
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
			networkHandler.get(DataHandler.ip + 'users?id=*', undefined, (value) => {
				if (value) {
					this.logger.info('Loaded user data');
					let users: ServerResponse<UserResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let usersMap: Map<string, UserResponse> = new Map<string, UserResponse>();
					users.msg.forEach((value) => {
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
			networkHandler.get(DataHandler.ip + 'services?id=*', undefined, (value) => {
				if (value) {
					this.logger.info('Loaded user data');
					let services: ServerResponse<ServicesResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let servicesMap: Map<string, ServicesResponse> = new Map<string, ServicesResponse>();
					services.msg.forEach((value) => {
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
			networkHandler.get(DataHandler.ip + 'companies?id=*', undefined, async (value) => {
				if (value) {
					let companies: ServerResponse<CompanyResponse[]> = JSON.parse(JSON.stringify(value[0]));
					resolve(companies.msg);
				}
				resolve([]);
			});
		});
	}

	public static async getCompanies(): Promise<CompanyData[]> {
		if (Date.now() - this.companies[0] < longDataCacheTime && this.companies[1].size > 0) return Array.from(this.companies[1].values());

		let companies: CompanyResponse[] = await this.getCompanyData();
		if (companies.length === 0) return [];

		let incidentData: IncidentResponse[] = await this.getIncidentsData();
		let companiesData: Map<string, CompanyData> = new Map<string, CompanyData>();
		for (let i = 0; i < companies.length; i++) {
			let priority: number = 5;
			let state: IncidentState = 'none';
			let secondaryState: IncidentState = 'none';
			let stateFound: boolean = false;
			for (let incidentsKey in incidentData) {
				let incident: IncidentResponse = incidentData[incidentsKey];

				if (incident.companyId !== companies[i].id) continue;

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
				priority: priority === 5 ? -1 : priority
			});
		}
		this.companies = [Date.now(), companiesData];
		return Array.from(companiesData.values());
	}

	public static async mergeIncidents(first: string, second: string): Promise<IncidentData | undefined> {
		let networking: Networking = new Networking();
		let body: MergeIncident = {
			first: first,
			second: second
		};
		let promise: Promise<IncidentData | undefined> = new Promise((resolve) => {
			networking.post(DataHandler.ip + 'merge', { body: body }, (value) => {
				if (value) {
					let data: ServerResponse<IncidentData> = JSON.parse(JSON.stringify(value[0]));
					if (data.statusCode === 200 || data.statusCode === 0) {
						resolve(data.msg);
						return;
					}
				}
				resolve(undefined);
			});
		});
		return promise;
	}
}

export default DataHandler;
