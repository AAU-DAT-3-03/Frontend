export const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
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

export const days: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

export function compareDatesLessThanOrEqual(date1: [number, number, number], date2: [number, number, number]): boolean {
	if (date1[2] < date2[2]) return true;
	if (date1[2] === date2[2] && date1[1] < date2[1]) return true;
	if (date1[2] === date2[2] && date1[1] == date2[1] && date1[0] <= date2[0]) return true;
	return false;
}

export function compareDatesEqual(date1: [number, number, number], date2: [number, number, number]): boolean {
	return date1[0] === date2[0] && date1[1] === date2[1] && date1[2] === date2[2];
}

export function dateFormatter(dateNumber: [number, number, number]): string {
	return `${dateNumber[0]} ${months[dateNumber[1] - 1]} ${dateNumber[2]}`;
}

export function daysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

export function getFirstDayInWeekOfMonth(year: number, month: number): number {
	month = month - 1 === -1 ? 11 : month - 1;
	let day: number = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1;
}
