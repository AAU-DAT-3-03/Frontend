import { IncidentType } from '../../components/incidentCard/IncidentCard';
import { IncidentState } from '../../components/StatusIcon';
import { User } from '../../components/AddUser';

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export class IncidentGenerator {
	static alarmId: number = 0;
	static incidentId: number = 0;

	private static nextIncidentId(): number {
		let id = IncidentGenerator.incidentId;
		IncidentGenerator.incidentId += 1;
		return id;
	}

	private static nextAlarmId(): number {
		let id: number = IncidentGenerator.alarmId;
		IncidentGenerator.alarmId += 1;
		return id;
	}

	private static generateAlarm(): Alarm {
		return {
			alarmError: alarmText[randomInt(0, alarmText.length - 1)],
			id: this.nextAlarmId()
		};
	}

	public static generateIncident(onlyResolved?: boolean): IncidentType {
		let state: IncidentState = randomInt(0, 1) === 1 ? 'error' : 'acknowledged';
		if (onlyResolved === true) state = 'resolved';
		let alarms: Alarm[] = [];
		for (let i = 0; i < randomInt(1, 5); i++) {
			alarms.push(this.generateAlarm());
		}

		let userList;
		if (randomInt(0, 1) === 1) {
			userList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				userList.push(users[randomInt(0, users.length - 1)]);
			}
		}

		let userCalledList;
		if (randomInt(0, 1) === 1) {
			userCalledList = [];
			for (let i: number = 0; i < randomInt(1, 5); i++) {
				userCalledList.push(users[randomInt(0, users.length - 1)]);
			}
		}

		let incident: IncidentType = {
			state: state,
			id: this.nextIncidentId(),
			alarms: alarms,
			caseNr: randomInt(0, 10000),
			company: companies[randomInt(0, companies.length - 1)],
			called: userCalledList,
			users: userList,
			priority: randomInt(1, 4),
			date: new Date(Date.now() - randomInt(0, 1000000))
		};
		return incident;
	}

	public static generateIncidentList(amount: number, onlyResolved?: boolean): IncidentType[] {
		let incidents: IncidentType[] = [];
		for (let i: number = 0; i < amount; i++) {
			incidents.push(this.generateIncident(onlyResolved));
		}
		return incidents;
	}
}

const companies: string[] = ['Jysk', 'Min Læge', 'Fut', 'Spar Nord', 'TrendHim', 'Norli', 'Opendo'];

type Alarm = { alarmError: string; id: number };

const alarmText: string[] = [
	'Crashed 4 times',
	'OOM Killed',
	'Restarted',
	'Pod unreachable',
	'Whopsie doopsie the server had an upsie',
	'Network error'
];

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
