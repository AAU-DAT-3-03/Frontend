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

	/**
	 * Registers a notification token.
	 * @param {string | null} token - The notification token to register.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the registration was successful.
	 */
	public static async registerNotification(token: string | null): Promise<boolean> {
		if (DataHandler.notificationRegistered && token !== null) return true;
		let networking: Networking = new Networking();
		let body: NotificationBody = {
			registrationToken: token
		};
		let promise: Promise<boolean> = new Promise((resolve): void => {
			// Post the notification to the server
			networking.post(DataHandler.ip + 'notification', { body: body }, (value: void | [object, Response]): void => {
				// If the server responds with a value
				if (value) {
					// Parse the response
					let response: { statusCode: number; msg: string } = JSON.parse(JSON.stringify(value[0]));
					// If the status code is 0, the registration was successful
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

	/**
	 * Gets a map of cookies from a response.
	 * @param {Response} response - The response to get the cookies from.
	 * @returns {Map<string, string> | undefined} A map of cookies, or undefined if no cookies were found.
	 */
	public static getCookiesMap(response: Response): Map<string, string> | undefined {
		if (!response.headers.has('set-cookie')) return undefined;

		let setCookie: string | null = response.headers.get('set-cookie');
		if (setCookie === null) {
			return undefined;
		}
		let cookiesSplit: string[] = setCookie?.split(';');
		let cookies: Map<string, string> = new Map<string, string>();
		for (let cookie of cookiesSplit) {
			// Split each cookie by '=' to get the key and value
			let keyValue: string[] = cookie.split('=', 2);
			if (keyValue.length < 2) {
				cookies.set(keyValue[0], '');
				continue;
			}
			cookies.set(keyValue[0], keyValue[1]);
		}
		return cookies;
	}

	/**
	 * Creates a map of incidents from a server response.
	 * @param {Array} value - The server response to create the map from.
	 * @returns {Promise<Map<string, IncidentResponse>>} A promise that creates a map of incidents.
	 */
	private static async createIncidentMap(value: [Object, Response]): Promise<Map<string, IncidentResponse>> {
		let response: ServerResponse<IncidentResponse[]> = JSON.parse(JSON.stringify(value[0]));
		let incidentMap: Map<string, IncidentResponse> = new Map<string, IncidentResponse>();

		response.msg.forEach((value: IncidentResponse): void => {
			incidentMap.set(value.id, value);
		});
		return incidentMap;
	}

	/**
	 * Creates a map of incidents from an array of incidents.
	 * @param {IncidentResponse[]} value - The array of incidents to create the map from.
	 * @returns {Promise<Map<string, IncidentResponse>>} A promise that creates a map of incidents.
	 */
	private static async createIncidentMapFromArray(value: IncidentResponse[]): Promise<Map<string, IncidentResponse>> {
		let incidentMap: Map<string, IncidentResponse> = new Map<string, IncidentResponse>();

		value.forEach((value: IncidentResponse): void => {
			incidentMap.set(value.id, value);
		});
		return incidentMap;
	}

	/**
	 * Gets a map of incident data.
	 * @returns {Promise<Map<string, IncidentResponse>>} A promise that gets a map of incident data.
	 */
	public static async getIncidentsDataMap(): Promise<Map<string, IncidentResponse>> {
		await this.getIncidentsData();
		return this.activeIncidents[1];
	}

	/**
	 * Gets all incident data for a given set of parameters.
	 * @param {string} params - The parameters to use when fetching the data.
	 * @returns {Promise<Map<string, IncidentResponse>>} A promise that creates a map of incident data.
	 */
	private static async getAllIncidentsData(params: string): Promise<Map<string, IncidentResponse>> {
		let networkHandler: Networking = new Networking();
		let incidentPromise: Promise<IncidentResponse[]> = new Promise((resolve): void => {
			// Use the network handler to get the data
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
		// Create a new promise for fetching service data
		let servicePromise: Promise<Map<string, ServicesResponse>> = new Promise(async (resolve): Promise<void> => {
			resolve(await this.getServicesMap());
		});

		// Return a new promise that resolves when both the incident and service promises have resolved
		return new Promise<Map<string, IncidentResponse>>((resolve) =>
			Promise.all([incidentPromise, servicePromise]).then(
				async (value: [IncidentResponse[], Map<string, ServicesResponse>]): Promise<void> => {
					let incidents: IncidentResponse[] = value[0];
					let services: Map<string, ServicesResponse> = value[1];
					// For each incident, update the service name for each alarm
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

	/**
	 * Gets incident data.
	 * @returns {Promise<IncidentResponse[]>} A promise that creates an array of incident data.
	 */
	public static async getIncidentsData(): Promise<IncidentResponse[]> {
		// Check if the data in activeIncidents is outdated or not present
		if (Date.now() - this.activeIncidents[0] > shortDataCacheTime || this.activeIncidents[1].size === 0) {
			let incidents: Map<string, IncidentResponse> = await DataHandler.getAllIncidentsData('?resolved=false');
			// Update the activeIncidents with the current time and the fetched data
			this.activeIncidents = [Date.now(), incidents];
		}

		return Array.from(this.activeIncidents[1].values());
	}

	/**
	 * Gets resolved incident data.
	 * @param {number} start - The start time for the data fetch.
	 * @param {number} end - The end time for the data fetch.
	 * @returns {Promise<IncidentResponse[]>} A promise that cteates an array of resolved incident data.
	 */
	public static async getResolvedIncidentsData(start: number, end: number): Promise<IncidentResponse[]> {
		// Check if the data in resolvedIncidents is outdated or not present
		if (Date.now() - this.resolvedIncidents[0] > shortDataCacheTime || this.resolvedIncidents[1].size === 0) {
			let incidents: Map<string, IncidentResponse> = await DataHandler.getAllIncidentsData(
				`?resolved=true&start=${start}&end=${end}`
			);
			// Update the resolvedIncidents with the current time and the fetched data
			this.resolvedIncidents = [Date.now(), incidents];
		}

		return Array.from(this.resolvedIncidents[1].values());
	}

	/**
	 * Gets a single incident response.
	 * @param {string} id - The ID of the incident to get the response for.
	 * @returns {Promise<IncidentResponse | undefined>} A promise that gets the incident response, or undefined if no response was found.
	 */
	public static async getIncidentResponse(id: string): Promise<IncidentResponse | undefined> {
		// Check if the data in activeIncidents is outdated or not present
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

	/**
	 * Updates an incident response.
	 * @param {UpdateIncident} data - The data to update the incident with.
	 * @returns {Promise<void>} A promise that resolves when the update is complete.
	 */
	public static async updateIncidentResponse(data: UpdateIncident): Promise<void> {
		let networkHandler: Networking = new Networking();
		
		// Return a promise that resolves when the update is complete
		return await new Promise((resolve): void => {
			// Send a PUT request to the server with the update data
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

	/**
	 * Gets the incident response without updating it.
	 * @returns {Map<string, IncidentResponse>} A map of the incident response.
	 */
	public static getIncidentResponseNoUpdate(): Map<string, IncidentResponse> {
		return this.activeIncidents[1];
	}

	/**
	 * Gets alarm data for a given ID.
	 * @param {string} id - The ID of the alarm to get the data for.
	 */
	public static async getAlarmData(id: string) {
		let networkHandler: Networking = new Networking();
		networkHandler.get(DataHandler.ip + `alarm?id=${id}`);
	}

	/**
	 * Authenticates the user. -used for login
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the authentication was successful.
	 */
	public static async auth(): Promise<boolean> {
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			// Send a GET request to the 'auth' endpoint
			networkHandler.get(DataHandler.ip + 'auth', undefined, (value: void | [object, Response]): void => {
				if (value) {
					let response: ServerResponse<AuthResponse> = JSON.parse(JSON.stringify(value[0]));
					
					// Store the user's details in local storage
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

	/**
	 * Logs in a user.
	 * @param {string} email - The email of the user.
	 * @param {string} password - The password of the user.
	 * @returns {Promise<[boolean, object]>} A promise that resolves to a tuple containing a boolean indicating whether the login was successful and an object containing the server response.
	 */
	public static async login(email: string, password: string): Promise<[boolean, object]> {
		let networkHandler: Networking = new Networking();
		let settings: LoginBody = {
			email: email,
			password: password
		};

		return new Promise((resolve): void => {
			// Send a POST request to the 'login' endpoint with the email and password
			networkHandler.post(
				DataHandler.ip + 'login',
				{
					body: settings,
					sendAuthKey: false
				},
				async (value: void | [object, Response]): Promise<void> => {
					if (value) {
						let response: Response = value[1];
						// Get the cookies from the response
						let cookies: Map<string, string> | undefined = this.getCookiesMap(response);
						if (cookies === undefined) {
							// Resolve the promise with a failure
							resolve([false, value]);
							return;
						}
						let token: string | undefined = cookies.get('authToken');
						if (token === undefined) {
							// Resolve the promise with a failure
							resolve([false, value]);
							return;
						}
						LocalStorage.setSettingsValue('authKey', token);
						// Authenticate the user
						await this.auth();
						// Resolve the promise with a success
						resolve([true, value]);
					}
					resolve([false, {}]);
				}
			);
		});
	}

	/**
	 * Gets a user.
	 * @param {string} id - The ID of the user to get.
	 * @returns {Promise<UserResponse | undefined>} A promise that gets the user, or undefined if no user was found.
	 */
	public static async getUser(id: string): Promise<UserResponse | undefined> {
		await this.getUsers();
		return this.users[1].get(id);
	}

	/**
	 * Gets a map of users.
	 * @returns {Promise<Map<string, UserResponse>>} A promise gets a map of users.
	 */
	public static async getUsersMap(): Promise<Map<string, UserResponse>> {
		await this.getUsers();
		return this.users[1];
	}

	/**
	 * Gets all users.
	 * @returns {Promise<UserResponse[]>} A promise that maps an array of users.
	 */
	public static async getUsers(): Promise<UserResponse[]> {
		// Check if the user data is still valid and return it if it is
		if (Date.now() - this.users[0] < longDataCacheTime && this.users[1].size > 0) return Array.from(this.users[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			// Fetch the user data from the server
			networkHandler.get(DataHandler.ip + 'users?id=*', undefined, (value: void | [object, Response]): void => {
				if (value) {
					this.logger.info('Loaded user data');
					let users: ServerResponse<UserResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let usersMap: Map<string, UserResponse> = new Map<string, UserResponse>();
					// Map the user data
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

	/**
	 * Gets a map of services.
	 * @returns {Promise<Map<string, ServicesResponse>>} A promise that resolves to a map of services.
	 */
	private static async getServicesMap(): Promise<Map<string, ServicesResponse>> {
		await this.getServicesData();
		return this.services[1];
	}

	/**
	 * Gets all services data.
	 * @returns {Promise<ServicesResponse[]>} A promise that resolves to an array of services data.
	 */
	private static async getServicesData(): Promise<ServicesResponse[]> {
		// Check if the services data is still valid and return it if it is
		if (Date.now() - this.services[0] < longDataCacheTime && this.services[1].size > 0) return Array.from(this.services[1].values());
		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			// Fetch the services data from the server
			networkHandler.get(DataHandler.ip + 'services?id=*', undefined, (value: void | [object, Response]): void => {
				if (value) {
					this.logger.info('Loaded user data');
					let services: ServerResponse<ServicesResponse[]> = JSON.parse(JSON.stringify(value[0]));
					let servicesMap: Map<string, ServicesResponse> = new Map<string, ServicesResponse>();
					// Map the services data
					services.msg.forEach((value: ServicesResponse): void => {
						servicesMap.set(value.id, value);
					});
					// Update the services data and its timestamp
					this.services = [Date.now(), servicesMap];
					resolve(services.msg);
					return;
				}
				// If no services data was found, resolve with an empty array
				resolve([]);
			});
		});
	}

	/**
	 * Gets a map of companies.
	 * @returns {Promise<Map<string, CompanyData>>} A promise that gets a map of companies.
	 */
	public static async getCompaniesMap(): Promise<Map<string, CompanyData>> {
		await this.getCompanies();
		return this.companies[1];
	}

	/**
	 * Gets a specific company.
	 * @param {string} id - The ID of the company to get.
	 * @returns {Promise<CompanyData | undefined>} A promise that gets the company, or undefined if no company was found.
	 */
	public static async getCompany(id: string): Promise<CompanyData | undefined> {
		await this.getCompanies();
		return this.companies[1].get(id);
	}

	/**
	 * Gets all company data.
	 * @returns {Promise<CompanyResponse[]>} A promise that resolves to an array of company data.
	 */
	private static async getCompanyData(): Promise<CompanyResponse[]> {
		// Check if the company data is still valid
		if (Date.now() - this.companies[0] < longDataCacheTime && this.companies[1].size > 0) return Array.from(this.companies[1].values());

		let networkHandler: Networking = new Networking();
		return new Promise((resolve) => {
			// Fetch the company data from the server
			networkHandler.get(DataHandler.ip + 'companies?id=*', undefined, async (value: void | [object, Response]): Promise<void> => {
				if (value) {
					let companies: ServerResponse<CompanyResponse[]> = JSON.parse(JSON.stringify(value[0]));
					resolve(companies.msg);
				}
				// If no company data was found, resolve with an empty array
				resolve([]);
			});
		});
	}

	/**
	 * Gets all companies.
	 * @returns {Promise<CompanyData[]>} A promise that creates an array of companies.
	 */
	public static async getCompanies(): Promise<CompanyData[]> {
		// Check if the companies data is still calid
		if (Date.now() - this.companies[0] < shortDataCacheTime && this.companies[1].size > 0)
			return Array.from(this.companies[1].values());

		let companies: CompanyResponse[] = [];
		let incidentData: IncidentResponse[] = [];
		// Fetch the company and incident data in parallel
		let companiesPromise: Promise<void> = new Promise(async (resolve): Promise<void> => {
			companies = await this.getCompanyData();
			resolve();
		});
		let incidentDataPromise: Promise<void> = new Promise(async (resolve): Promise<void> => {
			incidentData = await this.getIncidentsData();
			resolve();
		});

		await Promise.all([companiesPromise, incidentDataPromise]);

		// If no companies were found, return an empty array
		if (companies.length === 0) return [];
		let companiesData: Map<string, CompanyData> = new Map<string, CompanyData>();
		// Process each company
		for (let i = 0; i < companies.length; i++) {
			let priority: number = 5;
			let state: IncidentState = 'none';
			let secondaryState: IncidentState = 'none';
			let stateFound: boolean = false;
			let incidentReferences: string[] = [];
			// Process each incident
			for (let incidentsKey in incidentData) {
				let incident: IncidentResponse = incidentData[incidentsKey];

				// Skip incidents that don't belong to the current company
				if (incident.companyPublic.id !== companies[i].id) continue;
				incidentReferences.push(incident.id);
				// Update the company's priority if the incident's priority is higher
				if (priority > incident.priority) priority = incident.priority;
				if (stateFound) continue;

				let incidentResolved: boolean = incident.resolved;
				let incidentAcknowledged: boolean = incident.users.length > 0;
				let incidentError: boolean = !incidentAcknowledged && !incidentResolved;

				// Update the company's state based on the incident's state
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
			// Add the processed company to the companies data
			companiesData.set(companies[i].id, {
				id: companies[i].id,
				state: state,
				name: companies[i].name,
				secondaryState: secondaryState,
				priority: priority === 5 ? -1 : priority,
				incidentReferences: incidentReferences
			});
		}
		// Update the companies data and its timestamp
		this.companies = [Date.now(), companiesData];
		return Array.from(companiesData.values());
	}

	/**
	 * Merges two incidents.
	 * @param {string} first - The ID of the first incident.
	 * @param {string} second - The ID of the second incident.
	 * @returns {Promise<IncidentResponse | undefined>} A promise that the merges incident, or undefined if the merge failed.
	 */
	public static async mergeIncidents(first: string, second: string): Promise<IncidentResponse | undefined> {
		let networking: Networking = new Networking();
		let body: MergeIncident = {
			first: first,
			second: second
		};
		return new Promise((resolve): void => {
			// Send a merge request to the server
			networking.post(DataHandler.ip + 'merge', { body: body }, (value: void | [object, Response]): void => {
				if (value) {
					let data: ServerResponse<IncidentResponse> = JSON.parse(JSON.stringify(value[0]));
					// If the merge was successful, resolve with the merged incident
					if (data.statusCode === 200 || data.statusCode === 0) {
						resolve(data.msg);
						return;
					}
				}
				// If the merge failed, resolve with undefined
				resolve(undefined);
			});
		});
	}
}

export default DataHandler;
