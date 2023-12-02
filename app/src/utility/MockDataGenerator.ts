import { Alarm, EventLog, IncidentType } from '../components/incidentCard/IncidentCard';
import { IncidentState } from '../components/StatusIcon';
import { User } from '../components/AddUser';
import { ToastAndroid } from 'react-native';

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const alarmText: string[] = [
	'Crashed 4 times',
	'OOM Killed',
	'Restarted',
	'Pod unreachable',
	'Network error',
	'Internal Server Error',
	'Gateway Timeout',
	'Insufficient Storage',
	'Service Unavailable'
];

export type UpdateIncidentData = {
	priority?: number;
	incidentNote?: string;
	assignUser?: User;
	unAssignUser?: User;
	calledUser?: User;
	state?: IncidentState;
};

export type Company = {
	company: string;
	id: number;
	state: string;
	secondaryState: string;
	priority: number;
};

const companies: string[] = ['Jysk', 'Min Læge', 'Fut', 'Spar Nord', 'TrendHim', 'Norli', 'Opendo'];

export const users: User[] = [
	{ name: 'Bent', phoneNr: 87654321, team: 'Kubernetes' },
	{ name: 'Mette', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Kirsten', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Hanne', phoneNr: 12345678, team: 'Service Desk' },
	{ name: 'Anna', phoneNr: 12345678, team: 'Maintenance' },
	{ name: 'Helle', phoneNr: 12345678, team: 'Database' },
	{ name: 'Susanne', phoneNr: 12345678, team: 'Database' },
	{ name: 'Maria', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Lene', phoneNr: 12345678, team: 'Database' },
	{ name: 'Marianne', phoneNr: 12345678, team: 'Maintenance' },
	{ name: 'Camilla', phoneNr: 12345678, team: 'Database' },
	{ name: 'Lone', phoneNr: 12345678, team: 'Database' },
	{ name: 'Louise', phoneNr: 12345678, team: 'Service Desk' },
	{ name: 'Pia', phoneNr: 12345678, team: 'Database' },
	{ name: 'Charlotte', phoneNr: 12345678, team: 'Database' },
	{ name: 'Tina', phoneNr: 12345678, team: 'Database' },
	{ name: 'Gitte', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jette', phoneNr: 12345678, team: 'Maintenance' },
	{ name: 'Bente', phoneNr: 12345678, team: 'Service Desk' },
	{ name: 'Julie', phoneNr: 12345678, team: 'Database' },
	{ name: 'Michael', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Lars', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jens', phoneNr: 12345678, team: 'Database' },
	{ name: 'Thomas', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Henrik', phoneNr: 12345678, team: 'Maintenance' },
	{ name: 'Søren', phoneNr: 12345678, team: 'Database' },
	{ name: 'Christian', phoneNr: 12345678, team: 'Service Desk' },
	{ name: 'Martin', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Jan', phoneNr: 12345678, team: 'Database' },
	{ name: 'Morten', phoneNr: 12345678, team: 'Database' },
	{ name: 'Jesper', phoneNr: 12345678, team: 'Database' },
	{ name: 'Anders', phoneNr: 12345678, team: 'Maintenance' },
	{ name: 'Niels', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Mads', phoneNr: 12345678, team: 'Database' },
	{ name: 'Rasmus', phoneNr: 12345678, team: 'Database' },
	{ name: 'Per', phoneNr: 12345678, team: 'Database' },
	{ name: 'Mikkel', phoneNr: 12345678, team: 'Kubernetes' },
	{ name: 'Hans', phoneNr: 12345678, team: 'Database' },
	{ name: 'Kim', phoneNr: 1234567, team: 'Service Desk' }
];

export class MockDataGenerator {
	static alarms: { [id: number]: { alarm: Alarm; incidentId: number } } = {
		0: {
			incidentId: 0,
			alarm: {
				alarmLog: 'Jysk database 5 has crashed 4 times in the last 60 minutes',
				id: 0,
				alarmError: alarmText[0],
				alarmNote: '',
				service: 'Jysk-DB-5'
			}
		},
		1: {
			incidentId: 1,
			alarm: {
				alarmLog: "Pod hasn't been reachable for 5 minutes",
				id: 1,
				alarmError: alarmText[3],
				alarmNote: '',
				service: 'TH-WMS-1'
			}
		}
	};
	static incidents: { [id: number]: IncidentType } = {
		0: {
			id: 0,
			companyId: 0,
			company: 'Jysk',
			state: 'error',
			assignedUsers: [],
			incidentNote: '',
			startTime: Date.now() - 60000 * 5,
			eventLog: [
				{ user: users[3].name, dateTime: Date.now() - 60000 * 3, message: `Called ${users[12].name}` },
				{ user: users[0].name, dateTime: Date.now() - 60000 * 2, message: `Called ${users[0].name}` }
			],
			priority: 4,
			caseNr: 126,
			alarms: [MockDataGenerator.alarms[0].alarm],
			calledUsers: [users[12], users[0]]
		},
		1: {
			id: 1,
			companyId: 4,
			company: 'TrendHim',
			state: 'acknowledged',
			assignedUsers: [users[0]],
			incidentNote: '',
			startTime: Date.now() - 60000 * 20,
			eventLog: [
				{ user: users[3].name, dateTime: Date.now() - 60000 * 10, message: `Assigned ${users[0].name}` },
				{ user: users[3].name, dateTime: Date.now() - 60000 * 13, message: `Called ${users[10].name}` },
				{ user: users[3].name, dateTime: Date.now() - 60000 * 14, message: `Called ${users[0].name}` }
			],
			priority: 4,
			caseNr: 76,
			alarms: [MockDataGenerator.alarms[1].alarm],
			calledUsers: [users[0], users[10]]
		}
	};
	static alarmId: number = 2;
	static incidentId: number = 2;

	private static concatArrays<T>(a1: T[], a2: T[]): T[] {
		let temp: T[] = a1.concat(a2);
		let set: Set<T> = new Set(temp);
		return Array.from(set);
	}

	private static updateEventLog(eventLog: EventLog, incident: IncidentType): IncidentType {
		ToastAndroid.show('Change saved - ' + eventLog.message, 5);
		incident.eventLog.push(eventLog);
		return incident;
	}

	public static mergeIncidents(mainId: number, mergingId: number, user: string): void {
		let main: IncidentType = MockDataGenerator.getIncident(mainId);
		let merging: IncidentType = MockDataGenerator.getIncident(mergingId);

		if (main.companyId !== merging.companyId) return;
		if (main.state === 'resolved' || merging.state === 'resolved') return;

		if (main.priority < merging.priority) main.priority = merging.priority;
		if (main.state === 'error' && merging.state === 'acknowledged') main.state = 'acknowledged';
		if (main.startTime < merging.startTime) main.startTime = merging.startTime;
		if (main.incidentNote === '' && merging.incidentNote !== '') main.incidentNote = merging.incidentNote;

		main.assignedUsers = MockDataGenerator.concatArrays(main.assignedUsers, merging.assignedUsers);
		main.calledUsers = MockDataGenerator.concatArrays(main.calledUsers, merging.calledUsers);
		main.alarms = MockDataGenerator.concatArrays(main.alarms, merging.alarms);
		main.eventLog = main.eventLog.concat(merging.eventLog).sort((a, b) => {
			if (a.dateTime < b.dateTime) return 1;
			return -1;
		});
		main = this.updateEventLog(
			{
				user: user,
				dateTime: Date.now(),
				message: `Merged incident ${main.caseNr} with incident ${merging.caseNr}`
			},
			main
		);

		MockDataGenerator.incidents[mainId] = main;
		delete MockDataGenerator.incidents[mergingId];
	}

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
			MockDataGenerator.incidents[incidentId] = this.updateEventLog(
				{
					user: user,
					dateTime: Date.now(),
					message: `Changed incident note to: \n ${data.alarmNote}\n Old note: ${alarm.alarmNote}`
				},
				MockDataGenerator.incidents[incidentId]
			);
			alarm.alarmNote = data.alarmNote;
		}

		MockDataGenerator.alarms[id].alarm = alarm;
	}

	public static updateIncident(id: number, user: string, data: UpdateIncidentData): void {
		let incident: IncidentType = MockDataGenerator.incidents[id];
		if (incident.state === 'resolved') return;
		if (data.state) {
			incident.state = data.state;
			incident = this.updateEventLog({ user: user, dateTime: Date.now(), message: `Changed state to ${data.state}` }, incident);
		}
		if (data.priority) {
			incident.priority = data.priority;
			incident = this.updateEventLog({ user: user, dateTime: Date.now(), message: `Changed priority to ${data.priority}` }, incident);
		}
		if (data.incidentNote) {
			incident = this.updateEventLog(
				{
					user: user,
					dateTime: Date.now(),
					message: `Changed incident note to: \n ${data.incidentNote}\n Old note: ${incident.incidentNote}`
				},
				incident
			);

			incident.incidentNote = data.incidentNote;
		}
		if (data.assignUser !== undefined) {
			let test = incident.assignedUsers.filter(
				(value) =>
					value.name === data.assignUser?.name && value.team === data.assignUser.team && value.phoneNr === data.assignUser.phoneNr
			).length;
			if (test === 0) {
				if (incident.state === 'error') incident.state = 'acknowledged';
				incident.assignedUsers?.push(data.assignUser);
				incident = this.updateEventLog({ user: user, dateTime: Date.now(), message: `Assigned ${data.assignUser.name}` }, incident);
			}
		}
		if (data.unAssignUser) {
			incident.assignedUsers = incident.assignedUsers?.filter((userCurrent: User): boolean => {
				if (
					userCurrent.name === data.unAssignUser?.name &&
					userCurrent.team === data.unAssignUser?.team &&
					userCurrent.phoneNr === data.unAssignUser?.phoneNr
				) {
					incident = this.updateEventLog(
						{
							user: user,
							dateTime: Date.now(),
							message: `Removed user: ${userCurrent.name}`
						},
						incident
					);
					return false;
				}
				return true;
			});
			if (incident.state === 'acknowledged' && incident.assignedUsers?.length === 0) incident.state = 'error';
		}
		if (data.calledUser) {
			if (
				incident.calledUsers.filter(
					(value) =>
						value.name === data.calledUser?.name &&
						value.team === data.calledUser.team &&
						value.phoneNr === data.calledUser.phoneNr
				).length === 0
			) {
				incident.calledUsers?.push(data.calledUser);
				incident = this.updateEventLog(
					{
						user: user,
						dateTime: Date.now(),
						message: `Called ${data.calledUser.name}`
					},
					incident
				);
			}
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
		let soc: User = users[randomInt(0, 5)];
		let startTime: number = new Date(Date.now() - randomInt(150000, 1000000)).getTime();
		let priority: number = randomInt(1, 4);
		let eventLog: EventLog[] = [{ user: soc.name, dateTime: startTime + 60000, message: `Changed priority to ${priority}` }];
		if (onlyResolved === true) state = 'resolved';
		let alarms: Alarm[] = [];
		for (let i: number = 0; i < randomInt(1, 5); i++) {
			let alarm: Alarm = this.generateAlarm();
			MockDataGenerator.alarms[alarm.id] = { alarm: alarm, incidentId: id };
			alarms.push(alarm);
		}

		let userList: User[] = [];
		if (state === 'acknowledged' || state === 'resolved') {
			userList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				let user: User = users[randomInt(0, users.length - 1)];
				userList.push(user);
				eventLog.push({ user: soc.name, dateTime: startTime + 60000 * i * 3, message: `Assigned ${user.name}` });
			}
		}

		let userCalledList: User[] = [];
		if (randomInt(0, 1) === 1) {
			userCalledList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				let user: User = users[randomInt(0, users.length - 1)];
				userCalledList.push(users[randomInt(0, users.length - 1)]);
				eventLog.push({ user: soc.name, dateTime: startTime + 60000 * i * 1, message: `Called ${user.name}` });
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
			priority: priority,
			startTime: startTime,
			eventLog: eventLog,
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
			let secondaryState: IncidentState = 'none';
			let priority: number = 5;
			let stateFound: boolean = false;
			for (let incidentsKey in MockDataGenerator.incidents) {
				let incident: IncidentType = MockDataGenerator.incidents[incidentsKey];
				if (incident.companyId !== i) continue;
				if (priority > incident.priority) priority = incident.priority;

				if (stateFound) continue;

				let currentState: IncidentState = incident.state;
				if (currentState === 'none') continue;
				if (currentState === 'acknowledged' && state === 'error') {
					secondaryState = 'acknowledged';
					stateFound = true;
					continue;
				}
				if (currentState === 'error' || state === 'error') {
					state = 'error';
					continue;
				}

				if (currentState === 'acknowledged') state = 'acknowledged';
				if (currentState === 'resolved' && state !== 'acknowledged') state = 'resolved';
			}
			companiesData.push({
				company: companies[i],
				id: i,
				state: state,
				secondaryState: secondaryState,
				priority: priority === 5 ? -1 : priority
			});
		}
		return companiesData;
	}
}
