import React, { Component } from 'react';
import { TextInput } from 'react-native-paper';
import { NativeSyntheticEvent, TextInputSelectionChangeEventData, TextInputTextInputEventData } from 'react-native';
import { daysInMonth } from './DateHelper';
interface DataInputProps {
	value: [number, number, number];
	onChange: (date: [number, number, number]) => void;
}

class DateInput extends Component<DataInputProps> {
	state = {
		text: '',
		cursorPos: 0
	};

	constructor(props: DataInputProps) {
		super(props);
		this.state.text = this.dateFormatter(props.value);
	}

	private dateFormatter(date: [number, number, number]): string {
		let day: string = date[0] < 10 ? `0${date[0]}` : `${date[0]}`;
		let month: string = date[1] < 10 ? `0${date[1]}` : `${date[1]}`;
		return `${day}/${month}/${date[2]}`;
	}

	private replaceCharAtIndex(index: number, replacement: string, originalString: string): string {
		return originalString.substring(0, index) + replacement + originalString.substring(index + replacement.length);
	}

	private validateDate(): void {
		let values: string[] = this.state.text.split('/');
		if (values.length < 3) {
			this.setState({ text: '01/01/1970' });
			return;
		}

		let days: number = Number.parseInt(values[0], 10);
		if (Number.isNaN(days)) days = 1;

		let months: number = Number.parseInt(values[1], 10);
		if (Number.isNaN(months)) months = 1;

		let years: number = Number.parseInt(values[2], 10);
		if (Number.isNaN(years)) years = 1970;

		days = Math.min(days, daysInMonth(years, months));
		months = Math.min(months, 12);
		years = Math.max(years, 1970);

		this.props.onChange([days, months, years]);
		this.setState({ text: this.dateFormatter([days, months, years]) });
	}

	private async onTextInput(e: NativeSyntheticEvent<TextInputTextInputEventData>) {
		e.preventDefault();
		let index: number = e.nativeEvent.range.start;
		if (e.nativeEvent.text.length === 1) {
			// Triggered if character is inputted
			if (e.nativeEvent.range.start >= this.state.text.length) return;
			let char: string = e.nativeEvent.text;
			let number: number = Number.parseInt(char, 10);
			if (Number.isNaN(number)) return;
			while (index < this.state.text.length && this.state.text.at(index) === '/') {
				index++;
			}
			if (index < this.state.text.length) {
				await this.setState({
					text: this.replaceCharAtIndex(index, char, this.state.text),
					cursorPos: index + 1
				});
			}
		} else {
			while (index < this.state.text.length && this.state.text.at(index) === '/') {
				index--;
			}
			if (index < this.state.text.length) {
				await this.setState({
					text: this.replaceCharAtIndex(index, '0', this.state.text),
					cursorPos: index
				});
			}
		}
		this.validateDate();
	}

	render(): React.JSX.Element {
		return (
			<TextInput
				keyboardType={'numeric'}
				style={{ width: '100%' }}
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

export default DateInput;
