export interface LoginBody {
	email: string;
	password: string;
}

export interface ServerResponse<T> {
	msg: T;
	statusCode: number;
}

export interface AuthResponse {
	email: string;
	id: string;
	name: string;
	onCall: boolean;
	onDuty: boolean;
	password: string;
	phoneNumber: string;
}

export interface UserResponse {
	id: string;
	email: string;
	password: string;
	name: string;
	phoneNumber: string;
	onCall: boolean;
	onDuty: boolean;
	team: string;
}

export interface CompanyResponse {
	id: string;
	name: string;
}

export interface CompanyData extends CompanyResponse {
	state: string;
	secondaryState: string;
	priority: number;
	incidentReferences: string[];
}

export interface IncidentResponse {
	priority: number;
	resolved: boolean;
	header: string;
	acknowledgedBy: string;
	creationDate: number;
	companyPublic: { id: string; name: string };
	id: string;
	users: UserResponse[];
	calls: UserResponse[];
	incidentNote: string;
	eventLog: EventLog[];
	alarms: AlarmResponse[];
	caseNumber: number;
}

export interface EventLog {
	date: number;
	userName: string;
	userId: string;
	message: string;
}

export interface AlarmResponse {
	id: string;
	name: string;
	serviceId: string;
	serviceName: string;
}

export interface UpdateIncident {
	id: string;
	priority?: number;
	priorityNote?: string;
	resolved?: boolean;
	addUsers?: string[];
	addCalls?: string[];
	removeUsers?: string[];
	removeCalls?: string[];
	incidentNote?: string;
}

export interface MergeIncident {
	first: string;
	second: string;
}

export interface ServicesResponse {
	id: string;
	name: string;
	companyId: string;
}

export interface NotificationBody {
	registrationToken: string | null;
}
