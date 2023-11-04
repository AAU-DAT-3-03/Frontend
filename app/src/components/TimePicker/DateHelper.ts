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

export function getToday(offset?: number): number {
	let now: Date = new Date(Date.now());
	return new Date(now.getFullYear(), now.getMonth(), now.getDay() - 1 + (offset ?? 0)).getTime();
}

export function dateFormatter(dateNumber: number): string {
	let date: Date = new Date(dateNumber);
	let formattedDate: string = '';
	formattedDate += date.getDate() - 1 + ' ';
	formattedDate += months[date.getMonth()] + ' ';
	formattedDate += date.getFullYear();
	return formattedDate;
}

export function daysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

export function getFirstDayInWeekOfMonth(year: number, month: number): number {
	month = month - 1 === -1 ? 11 : month - 1;
	let day: number = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1;
}
