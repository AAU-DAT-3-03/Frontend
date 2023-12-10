import { IncidentResponse, UserResponse } from './DataHandlerTypes';

export function filterIncidentList(incident: IncidentResponse, query: string): boolean {
	if (query !== '') {
		let queries: [boolean, string][] = query
			.toLowerCase()
			.split(' ')
			.map((value: string) => [false, value]);
		for (let query of queries) {
			if (incident.companyPublic.name.toLowerCase().includes(query[1])) {
				query[0] = true;
				continue;
			}
			if (incident.caseNumber?.toString(10).includes(query[1])) {
				query[0] = true;
				continue;
			}

			if (
				incident.calls !== undefined &&
				incident.calls.filter((user: UserResponse) => {
					if (user === undefined) return false;
					return user.name.toLowerCase().includes(query[1]) || user.team?.toLowerCase().includes(query[1]);
				}).length > 0
			) {
				query[0] = true;
				continue;
			}

			if (
				incident.users !== undefined &&
				incident.users.filter((user: UserResponse) => {
					if (user === undefined) return false;
					return user.name.toLowerCase().includes(query[1]) || user.team?.toLowerCase().includes(query[1]);
				}).length > 0
			) {
				query[0] = true;
				continue;
			}

			if (incident.priority.toString(10).includes(query[1])) {
				query[0] = true;
			}
		}
		let queriesHit: number = queries.filter((value: [boolean, string]): boolean => value[0] === true).length;
		if (queriesHit === queries.length) {
			return true;
		}
		return false;
	}
	return true;
}

export const compareIncident = (a: IncidentResponse, b: IncidentResponse): number => {
	if (a.priority > b.priority) return 1;
	if (a.priority < b.priority) return -1;

	let aIncidentResolved: boolean = a.resolved;
	let aIncidentAcknowledged: boolean = a.users.length > 0;
	let aIncidentError: boolean = !aIncidentAcknowledged && !aIncidentResolved;

	let bIncidentResolved: boolean = b.resolved;
	let bIncidentAcknowledged: boolean = b.users.length > 0;
	let bIncidentError: boolean = !bIncidentAcknowledged && !bIncidentResolved;

	if (a.priority === b.priority) {
		if (aIncidentAcknowledged && bIncidentError) return 1;
		if (aIncidentError && bIncidentAcknowledged) return -1;
	}

	if (bIncidentResolved === aIncidentResolved && aIncidentAcknowledged === bIncidentAcknowledged) {
		if (a.companyPublic.id.toLowerCase() < b.companyPublic.id.toLowerCase()) return -1;
		if (a.companyPublic.id.toLowerCase() > b.companyPublic.id.toLowerCase()) return 1;
	}

	if (a.companyPublic.id === b.companyPublic.id) {
		if (a.caseNumber === undefined || b.caseNumber === undefined) return 0;
		if (a.caseNumber > b.caseNumber) return 1;
		return -1;
	}

	return 0;
};
