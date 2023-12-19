import React, { Component } from 'react';
import { TextInput } from 'react-native-paper';
import { NativeSyntheticEvent, StyleProp, TextInputSelectionChangeEventData, TextInputTextInputEventData, ViewStyle } from 'react-native';
import { daysInMonth } from './DateHelper';
import { PickerDate } from './TimePicker';
interface DataInputProps {
	value: PickerDate;
	onChange: (date: PickerDate) => void;
}

interface DataInputState {
	text: string;
	cursorPos: number;
}

class DateInput extends Component<DataInputProps, DataInputState> {
	state: DataInputState = {
		text: '',
		cursorPos: 0
	};

	constructor(props: DataInputProps) {
		super(props);
		this.state.text = DateInput.dateFormatter(props.value);
	}

	/**
	 * Formats a PickerDate into a date string
	 * @param {PickerDate} date - The date to convert
	 * @return {string} - the formatted date string
	 */
	public static dateFormatter(date: PickerDate): string {
		let day: string = date[0] < 10 ? `0${date[0]}` : `${date[0]}`;
		let month: string = date[1] < 10 ? `0${date[1]}` : `${date[1]}`;
		return `${day}/${month}/${date[2]}`;
	}

	/**
	 * Replaces a char with a string in a string
	 * @param {number} index - Index of the char to replace
	 * @param {string} replacement - The string to replace it with
	 * @param {string} originalString - The original string to replace in
	 * @return {string} - The new string with the replace string
	 */
	private replaceCharAtIndex(index: number, replacement: string, originalString: string): string {
		return originalString.substring(0, index) + replacement + originalString.substring(index + replacement.length);
	}

	/**
	 * Validates the inputted string conforms to the right format: dd/mm/yyyy
	 */
	private validateDate(): void {
		// Split the string and check it has 3 values
		let values: string[] = this.state.text.split('/');
		if (values.length < 3) {
			this.setState({ text: '01/01/1970' });
			return;
		}

		// Convert the first being day and check it's number
		let days: number = Number.parseInt(values[0], 10);
		if (Number.isNaN(days)) days = 1;

		// Convert the first being month and check it's number
		let months: number = Number.parseInt(values[1], 10);
		if (Number.isNaN(months)) months = 1;

		// Convert the first being year and check it's number
		let years: number = Number.parseInt(values[2], 10);
		if (Number.isNaN(years)) years = 1970;

		// Validate the dates are real dates after 1970
		days = Math.min(days, daysInMonth(years, months));
		months = Math.min(months, 12);
		years = Math.max(years, 1970);

		// Call the onChange callback given in props and update the state of the component
		this.props.onChange([days, months, years]);
		this.setState({ text: DateInput.dateFormatter([days, months, years]) });
	}

	/**
	 * Handles onTextInput of the TextInput component. It ensures the strict format is kept
	 * @param {NativeSyntheticEvent<TextInputTextInputEventData>} e - The event of the onTextInput from the TextInput component
	 */
	private async onTextInput(e: NativeSyntheticEvent<TextInputTextInputEventData>): Promise<void> {
		// Prevent other event listeners from triggering
		e.preventDefault();
		// Get the index the change was made in the string
		let index: number = e.nativeEvent.range.start;
		// Check if the inputted string is a single character, otherwise it's a delete input
		if (e.nativeEvent.text.length === 1) {
			// Triggered if character is inputted
			if (e.nativeEvent.range.start >= this.state.text.length) return;
			// Get the inputted character and check it's a number otherwise do nothing and return
			let char: string = e.nativeEvent.text;
			let number: number = Number.parseInt(char, 10);
			if (Number.isNaN(number)) return;
			// Go through the string to find the first number
			while (index < this.state.text.length && this.state.text.at(index) === '/') {
				index++;
			}
			// Replace the number with the inputted number if it's in bound
			if (index < this.state.text.length) {
				this.setState({
					text: this.replaceCharAtIndex(index, char, this.state.text),
					cursorPos: index + 1
				});
			}
		} else {
			// Go through the string to find the first number
			while (index < this.state.text.length && this.state.text.at(index) === '/') {
				index--;
			}
			// Replace the number with 0 if it's in bound
			if (index < this.state.text.length) {
				this.setState({
					text: this.replaceCharAtIndex(index, '0', this.state.text),
					cursorPos: index
				});
			}
		}
		// Validate the date
		this.validateDate();
	}

	render(): React.JSX.Element {
		return (
			<TextInput
				keyboardType={'numeric'}
				style={fullWidthStyle}
				label={'Date'}
				value={this.state.text}
				selection={{ start: this.state.cursorPos }}
				onSelectionChange={(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
					this.setState({ cursorPos: event.nativeEvent.selection.start });
				}}
				onTextInput={(e: NativeSyntheticEvent<TextInputTextInputEventData>) => this.onTextInput(e)}
			/>
		);
	}
}

const fullWidthStyle: StyleProp<ViewStyle> = { width: '100%' };

export default DateInput;
