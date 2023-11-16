import { IncidentType } from '../../components/incidentCard/IncidentCard';
import { IncidentState } from '../../components/StatusIcon';

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

		let userList: User[] = [];
		for (let i: number = 0; i < randomInt(1, 5); i++) {
			userList.push(users[randomInt(0, users.length - 1)]);
		}

		let incident: IncidentType = {
			state: state,
			id: this.nextIncidentId(),
			alarms: alarms,
			caseNr: randomInt(0, 10000),
			company: companies[randomInt(0, companies.length - 1)],
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

type User = { name: string; phoneNr: number };

const users: User[] = [
	{ name: 'Mette', phoneNr: 12345678 },
	{ name: 'Kirsten', phoneNr: 12345678 },
	{ name: 'Hanne', phoneNr: 12345678 },
	{ name: 'Anna', phoneNr: 12345678 },
	{ name: 'Helle', phoneNr: 12345678 },
	{ name: 'Susanne', phoneNr: 12345678 },
	{ name: 'Maria', phoneNr: 12345678 },
	{ name: 'Lene', phoneNr: 12345678 },
	{ name: 'Marianne', phoneNr: 12345678 },
	{ name: 'Camilla', phoneNr: 12345678 },
	{ name: 'Lone', phoneNr: 12345678 },
	{ name: 'Louise', phoneNr: 12345678 },
	{ name: 'Pia', phoneNr: 12345678 },
	{ name: 'Charlotte', phoneNr: 12345678 },
	{ name: 'Tina', phoneNr: 12345678 },
	{ name: 'Gitte', phoneNr: 12345678 },
	{ name: 'Jette', phoneNr: 12345678 },
	{ name: 'Bente', phoneNr: 12345678 },
	{ name: 'Julie', phoneNr: 12345678 },
	{ name: 'Michael', phoneNr: 12345678 },
	{ name: 'Lars', phoneNr: 12345678 },
	{ name: 'Jens', phoneNr: 12345678 },
	{ name: 'Thomas', phoneNr: 12345678 },
	{ name: 'Henrik', phoneNr: 12345678 },
	{ name: 'Søren', phoneNr: 12345678 },
	{ name: 'Christian', phoneNr: 12345678 },
	{ name: 'Martin', phoneNr: 12345678 },
	{ name: 'Jan', phoneNr: 12345678 },
	{ name: 'Morten', phoneNr: 12345678 },
	{ name: 'Jesper', phoneNr: 12345678 },
	{ name: 'Anders', phoneNr: 12345678 },
	{ name: 'Niels', phoneNr: 12345678 },
	{ name: 'Mads', phoneNr: 12345678 },
	{ name: 'Rasmus', phoneNr: 12345678 },
	{ name: 'Per', phoneNr: 12345678 },
	{ name: 'Mikkel', phoneNr: 12345678 },
	{ name: 'Hans', phoneNr: 12345678 },
	{ name: 'Kim', phoneNr: 12345678 }
];
