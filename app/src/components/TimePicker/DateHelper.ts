export const monthsAbbreviated: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const fullMonths: string[] = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const daysAbbreviated: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * @brief Function to get today's date with optional offset
 * @param {number} offset - number of days to offset from today's date
 * @returns array representing the date [day, month, year]
 */
export function getToday(offset?: number): [number, number, number] {
	let now: Date = new Date(Date.now());
	let month: number = now.getMonth() + 1;
	let year: number = now.getFullYear();
	let day: number = now.getDate() + (offset ?? 0);
	if (day > daysInMonth(now.getFullYear(), month)) {
		day = 1;
		month += 1;
	} else if (day < 1) {
		month -= 1;
		if (month < 1) {
			month = 12;
			year -= 1;
		}
		day = daysInMonth(now.getFullYear(), month);
	}
	if (month > 12) {
		month = 1;
		year += 1;
	}
	return [day, month, year];
}

/**
 * @brief Function to compare if date is less than or equal to another date
 * @param {[number, number, number]} date1 - array representing the first date [day, month, year]
 * @param {[number, number, number]} date2 - array representing the second date [day, month, year]
 * @returns boolean indicating if date1 is less than or equal to date2
 */
export function compareDatesLessThanOrEqual(date1: [number, number, number], date2: [number, number, number]): boolean {
	if (date1[2] < date2[2]) return true;
	if (date1[2] === date2[2] && date1[1] < date2[1]) return true;
	if (date1[2] === date2[2] && date1[1] == date2[1] && date1[0] <= date2[0]) return true;
	return false;
}

/**
 * @brief Function to compare if a date is equal to another date
 * @param {[number, number, number]} date1 - array representing the first date [day, month, year]
 * @param {[number, number, number]} date2 - array representing the second date [day, month, year]
 * @returns boolean indicating if date1 is equal to date2
 */
export function compareDatesEqual(date1: [number, number, number], date2: [number, number, number]): boolean {
	return date1[0] === date2[0] && date1[1] === date2[1] && date1[2] === date2[2];
}

/**
 * @brief Function to format a date array into a string
 * @param {[number, number, number]} dateNumber - array representing the date [day, month, year]
 * @returns string representing the formatted date
 */
export function dateFormatter(dateNumber: [number, number, number]): string {
	return `${dateNumber[0]} ${monthsAbbreviated[dateNumber[1] - 1]} ${dateNumber[2]}`;
}

/**
 * @brief Function to get the number of days in a month
 * @param {number} year - the year of the month
 * @param {number} month - the month to get the number of days for
 * @returns number representing the number of days in the month
 */
export function daysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

/**
 * @brief Function to get the first day of the week of a month
 * @param {number} year - the year of the month
 * @param {number} month - the month to get the first day of the week for
 * @returns number representing the first day of the week of the month
 */
export function getFirstDayInWeekOfMonth(year: number, month: number): number {
	month = month - 1 === -1 ? 11 : month - 1;
	let day: number = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1;
}
