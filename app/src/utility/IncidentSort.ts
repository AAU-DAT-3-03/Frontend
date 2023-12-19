import { IncidentResponse, UserResponse } from './DataHandlerTypes';

/**
 * Filters incidents based on a search query
 * @param {IncidentResponse} incident - The incident to filter
 * @param {string} query - The search query
 * @returns {boolean} - True if the incident matches the query, false otherwise
 */
export function filterIncidentList(incident: IncidentResponse, query: string): boolean {
	if (query !== '') {
		// Split the query into individual words and create an array of [hit, word] pairs
		let queries: [boolean, string][] = query
			.toLowerCase()
			.split(' ')
			.map((value: string) => [false, value]);

		// Check each word against incident properties
		for (let query of queries) {
			// Check if the company name includes the query word
			if (incident.companyPublic.name.toLowerCase().includes(query[1])) {
				query[0] = true;
				continue;
			}

			// Check if the case number includes the query word
			if (incident.caseNumber?.toString(10).includes(query[1])) {
				query[0] = true;
				continue;
			}

			// Check if any call username or team includes the query word
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

			// Check if any incident username or team includes the query word
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

			// Check if the priority includes the query word
			if (incident.priority.toString(10).includes(query[1])) {
				query[0] = true;
			}
		}

		// Count the number of hits
		let queriesHit: number = queries.filter((value: [boolean, string]): boolean => value[0] === true).length;

		// If all words are hit, return true. Otherwise, return false
		if (queriesHit === queries.length) {
			return true;
		}
		return false;
	}
	// If the query is empty, consider the incident a match
	return true;
}

/**
 * Compares two incidents based on priority, acknowledgment, resolution, and company ID.
 * This function is used for sorting incidents
 * @param {IncidentResponse} a - The first incident to compare
 * @param {IncidentResponse} b - The second incident to compare
 * @returns {number} - 1 if a should come after b, -1 if a should come before b, 0 if they are equal
 */
export const compareIncident = (a: IncidentResponse, b: IncidentResponse): number => {
	// Compare incidents based on priority
	if (a.priority > b.priority) return 1;
	if (a.priority < b.priority) return -1;

	// Check acknowledged and resolved status
	let aIncidentResolved: boolean = a.resolved;
	let aIncidentAcknowledged: boolean = a.users.length > 0;
	let aIncidentError: boolean = !aIncidentAcknowledged && !aIncidentResolved;

	let bIncidentResolved: boolean = b.resolved;
	let bIncidentAcknowledged: boolean = b.users.length > 0;
	let bIncidentError: boolean = !bIncidentAcknowledged && !bIncidentResolved;

	// Handles cases where acknowledged and resolved affect sorting
	if (a.priority === b.priority) {
		if (aIncidentAcknowledged && bIncidentError) return 1;
		if (aIncidentError && bIncidentAcknowledged) return -1;
	}

	// Check company ID
	if (bIncidentResolved === aIncidentResolved && aIncidentAcknowledged === bIncidentAcknowledged) {
		if (a.companyPublic.id.toLowerCase() < b.companyPublic.id.toLowerCase()) return -1;
		if (a.companyPublic.id.toLowerCase() > b.companyPublic.id.toLowerCase()) return 1;
	}

	// If all checks pass, compare by case number
	if (a.companyPublic.id === b.companyPublic.id) {
		if (a.caseNumber === undefined || b.caseNumber === undefined) return 0;
		if (a.caseNumber > b.caseNumber) return 1;
		return -1;
	}

	// Return 0 if incidents are considered equal
	return 0;
};
