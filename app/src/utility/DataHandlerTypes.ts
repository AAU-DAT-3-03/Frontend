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
	team?: string;
}

export interface CompanyResponse {
	id: string;
	name: string;
}

export interface CompanyData extends CompanyResponse {
	state: string;
	secondaryState: string;
	priority: number;
}

export interface IncidentResponse {
	priority: number;
	resolved: boolean;
	header: string;
	acknowledgedBy: string;
	creationDate: number;
	companyId: string;
	id: string;
	users: UserResponse[];
	calls: UserResponse[];
	incidentNote: string;
	eventLog?: EventLog[];
	alarms: AlarmResponse[];
	caseNumber?: number;
}

export interface IncidentData extends IncidentResponse {
	companyName: string;
}

export interface EventLog {
	user: string;
	message: string;
	dateTime: number;
}

export interface AlarmResponse {
	id: string;
	name: string;
	serviceId: string;
}

export interface UpdateIncident {
	id: string;
	priority?: number;
	resolved?: boolean;
	addUsers?: string[];
	addCalls?: string[];
	removeUsers?: string[];
	removeCalls?: string[];
	incidentNote?: string;
}
