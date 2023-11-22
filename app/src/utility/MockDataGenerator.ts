import { Alarm, IncidentType } from '../components/incidentCard/IncidentCard';
import { IncidentState } from '../components/StatusIcon';
import { User } from '../components/AddUser';

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const alarmText: string[] = [
	'Crashed 4 times',
	'OOM Killed',
	'Restarted',
	'Pod unreachable',
	'Whopsie doopsie the server had an upsie',
	'Network error'
];

export class MockDataGenerator {
	static alarms: { [id: number]: { alarm: Alarm; incidentId: number } } = {};
	static incidents: { [id: number]: IncidentType } = {};
	static alarmId: number = 0;
	static incidentId: number = 0;

	public static getAllIncidents(): IncidentType[] {
		let incidents: IncidentType[] = [];
		for (let incidentsKey in MockDataGenerator.incidents) {
			incidents.push(MockDataGenerator.incidents[incidentsKey]);
		}
		return incidents;
	}

	public static getIncident(id: number): IncidentType {
		return MockDataGenerator.incidents[id];
	}

	public static getAlarm(id: number): Alarm {
		return MockDataGenerator.alarms[id].alarm;
	}

	public static updateAlarm(
		id: number,
		user: string,
		data: {
			alarmNote?: string;
		}
	): void {
		let alarm: Alarm = MockDataGenerator.alarms[id].alarm;
		let incidentId: number = MockDataGenerator.alarms[id].incidentId;
		if (data.alarmNote) {
			MockDataGenerator.incidents[incidentId].eventLog?.push({
				user: user,
				dateTime: Date.now(),
				message: `Changed incident note to: \n ${data.alarmNote}\n Old note: ${alarm.alarmNote}`
			});
			alarm.alarmNote = data.alarmNote;
		}

		MockDataGenerator.alarms[id].alarm = alarm;
	}

	public static updateIncident(
		id: number,
		user: string,
		data: {
			priority?: number;
			incidentNote?: string;
			assignUser?: User;
			unAssignUser?: User;
			calledUser?: User;
			state?: IncidentState;
		}
	): void {
		let incident: IncidentType = MockDataGenerator.incidents[id];
		if (data.priority) {
			incident.priority = data.priority;
			incident.eventLog?.push({ user: user, dateTime: Date.now(), message: `Changed priority to ${data.priority}` });
		}
		if (data.incidentNote) {
			incident.eventLog?.push({
				user: user,
				dateTime: Date.now(),
				message: `Changed incident note to: \n ${data.incidentNote}\n Old note: ${incident.incidentNote}`
			});
			incident.incidentNote = data.incidentNote;
		}
		if (data.assignUser) {
			incident.assignedUsers?.push(data.assignUser);
			incident.eventLog?.push({ user: user, dateTime: Date.now(), message: `Assigned user ${data.assignUser}` });
		}
		if (data.unAssignUser)
			incident.assignedUsers = incident.assignedUsers?.filter((userCurrent: User): boolean => {
				if (
					userCurrent.name !== data.unAssignUser?.name &&
					userCurrent.team !== data.unAssignUser?.team &&
					userCurrent.phoneNr !== data.unAssignUser?.phoneNr
				) {
					incident.eventLog?.push({ user: user, dateTime: Date.now(), message: `Removed user: ${userCurrent.name}` });
					return false;
				}
				return true;
			});
		if (data.calledUser) {
			incident.calledUsers?.push(data.calledUser);
			incident.eventLog?.push({ user: user, dateTime: Date.now(), message: `Called user: ${data.calledUser.name}` });
		}
		if (data.state) {
			incident.state = data.state;
			incident.eventLog?.push({ user: user, dateTime: Date.now(), message: `Changed state to ${data.state}` });
		}

		MockDataGenerator.incidents[id] = incident;
	}

	private static nextIncidentId(): number {
		let id: number = MockDataGenerator.incidentId;
		MockDataGenerator.incidentId += 1;
		return id;
	}

	private static nextAlarmId(): number {
		let id: number = MockDataGenerator.alarmId;
		MockDataGenerator.alarmId += 1;
		return id;
	}

	private static generateAlarm(): Alarm {
		let errorNumber: number = randomInt(0, alarmText.length - 1);
		return {
			alarmLog: alarmText[errorNumber],
			alarmNote: '',
			service: 'Service-' + randomInt(0, 150),
			alarmError: alarmText[errorNumber],
			id: this.nextAlarmId()
		};
	}

	public static generateIncident(onlyResolved?: boolean): IncidentType {
		let state: IncidentState = randomInt(0, 1) === 1 ? 'error' : 'acknowledged';
		let id: number = this.nextIncidentId();
		if (onlyResolved === true) state = 'resolved';
		let alarms: Alarm[] = [];
		for (let i: number = 0; i < randomInt(1, 5); i++) {
			let alarm: Alarm = this.generateAlarm();
			MockDataGenerator.alarms[alarm.id] = { alarm: alarm, incidentId: id };
			alarms.push(alarm);
		}

		let userList: User[] | undefined;
		if (state === 'acknowledged' || state === 'resolved') {
			userList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				userList.push(users[randomInt(0, users.length - 1)]);
			}
		}

		let userCalledList: User[] | undefined;
		if (randomInt(0, 1) === 1) {
			userCalledList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				userCalledList.push(users[randomInt(0, users.length - 1)]);
			}
		}

		let companyId: number = randomInt(0, companies.length - 1);

		let incident: IncidentType = {
			state: state,
			id: id,
			alarms: alarms,
			caseNr: randomInt(0, 10000),
			company: companies[companyId],
			calledUsers: userCalledList,
			assignedUsers: userList,
			priority: randomInt(1, 4),
			startTime: new Date(Date.now() - randomInt(0, 1000000)).getTime(),
			eventLog: [],
			incidentNote: '',
			companyId: companyId
		};
		MockDataGenerator.incidents[incident.id] = incident;
		return incident;
	}

	public static generateIncidentList(amount: number, onlyResolved?: boolean): IncidentType[] {
		let incidents: IncidentType[] = [];
		for (let i: number = 0; i < amount; i++) {
			incidents.push(this.generateIncident(onlyResolved));
		}
		return incidents;
	}

	public static getCompanies(): Company[] {
		let companiesData: Company[] = [];
		for (let i = 0; i < companies.length; i++) {
			let state: IncidentState = 'none';
			for (let incidentsKey in MockDataGenerator.incidents) {
				let incident: IncidentType = MockDataGenerator.incidents[incidentsKey];
				if (incident.companyId !== i) continue;
				let currentState: IncidentState = incident.state;
				if (currentState === 'none') continue;
				if (currentState === 'error') {
					state = 'error';
					break;
				}
				if (currentState === 'acknowledged') state = 'acknowledged';
				if (currentState === 'resolved' && state !== 'acknowledged') state = 'resolved';
			}
			companiesData.push({
				company: companies[i],
				id: i,
				state: state
			});
		}
		return companiesData;
	}
}

export type Company = {
	company: string;
	id: number;
	state: string;
};

const companies: string[] = ['Jysk', 'Min Læge', 'Fut', 'Spar Nord', 'TrendHim', 'Norli', 'Opendo'];

export const users: User[] = [
	{ name: 'Mette', phoneNr: 12345678, team: 'Database' },
	{ name: 'Kirsten', phoneNr: 12345678, team: 'Database' },
	{ name: 'Hanne', phoneNr: 12345678, team: 'Database' },
	{ name: 'Anna', phoneNr: 12345678, team: 'Database' },
	{ name: 'Helle', phoneNr: 12345678, team: 'Database' },
	{ name: 'Susanne', phoneNr: 12345678, team: 'Database' },
	{ name: 'Maria', phoneNr: 12345678, team: 'Database' },
	{ name: 'Lene', phoneNr: 12345678, team: 'Database' },
	{ name: 'Marianne', phoneNr: 12345678, team: 'Database' },
	{ name: 'Camilla', phoneNr: 12345678, team: 'Database' },
	{ name: 'Lone', phoneNr: 12345678, team: 'Database' },
	{ name: 'Louise', phoneNr: 12345678, team: 'Database' },
	{ name: 'Pia', phoneNr: 12345678, team: 'Database' },
	{ name: 'Charlotte', phoneNr: 12345678, team: 'Database' },
	{ name: 'Tina', phoneNr: 12345678, team: 'Database' },
	{ name: 'Gitte', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jette', phoneNr: 12345678, team: 'Database' },
	{ name: 'Bente', phoneNr: 12345678, team: 'Database' },
	{ name: 'Julie', phoneNr: 12345678, team: 'Database' },
	{ name: 'Michael', phoneNr: 12345678, team: 'Database' },
	{ name: 'Lars', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jens', phoneNr: 12345678, team: 'Database' },
	{ name: 'Thomas', phoneNr: 12345678, team: 'Database' },
	{ name: 'Henrik', phoneNr: 12345678, team: 'Database' },
	{ name: 'Søren', phoneNr: 12345678, team: 'Database' },
	{ name: 'Christian', phoneNr: 12345678, team: 'Database' },
	{ name: 'Martin', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jan', phoneNr: 12345678, team: 'Database' },
	{ name: 'Morten', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jesper', phoneNr: 12345678, team: 'Database' },
	{ name: 'Anders', phoneNr: 12345678, team: 'Database' },
	{ name: 'Niels', phoneNr: 12345678, team: 'Database' },
	{ name: 'Mads', phoneNr: 12345678, team: 'Database' },
	{ name: 'Rasmus', phoneNr: 12345678, team: 'Database' },
	{ name: 'Per', phoneNr: 12345678, team: 'Database' },
	{ name: 'Mikkel', phoneNr: 12345678, team: 'Database' },
	{ name: 'Hans', phoneNr: 12345678, team: 'Database' },
	{ name: 'Kim', phoneNr: 1234567, team: 'Database' }
];
