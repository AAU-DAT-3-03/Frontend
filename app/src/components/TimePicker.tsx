import React, { Component } from 'react';
import { Modal, Portal, Text, IconButton, Button } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { StyleProp, View, ViewStyle } from 'react-native';

const month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const day: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const modalStyle: StyleProp<ViewStyle> = {
	padding: 16,
	backgroundColor: getCurrentTheme().colors?.surface,
	borderRadius: 30,
	maxHeight: '80%',
	maxWidth: '90%',
	position: 'absolute',
	left: '10%',
	top: '20%'
};

const mainViewStyle: StyleProp<ViewStyle> = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	width: '100%',
	height: '100%'
};

const rowStyle: StyleProp<ViewStyle> = {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap'
};

interface TimePickerProps {
	visible: boolean;
	onDismiss?: (date: [number, number]) => void;
}

interface TimePickerState {
	currentMonth: number;
	currentYear: number;
	selectedTimeStart: number;
	selectedTimeEnd: number;
}

class TimePicker extends Component<TimePickerProps, TimePickerState> {
	state: TimePickerState = {
		currentMonth: 10,
		currentYear: 2023,
		selectedTimeStart: 0,
		selectedTimeEnd: 0
	};

	constructor(props: TimePickerProps) {
		super(props);
	}

	private onDismiss(): void {
		if (this.props.onDismiss === undefined) return;
		this.props.onDismiss([this.state.selectedTimeStart, this.state.selectedTimeEnd]);
	}

	private dateFormatter(dateNumber: number): string {
		let date: Date = new Date(dateNumber);
		let formattedDate: string = '';
		formattedDate += date.getDate() + ' ';
		formattedDate += month[date.getMonth()] + ' ';
		formattedDate += date.getFullYear();
		return formattedDate;
	}

	private daysInMonth(year: number, month: number): number {
		return new Date(year, month, 0).getDate();
	}

	private getFirstDayInWeekOfMonth(year: number, month: number): number {
		month = month - 1 === -1 ? 11 : month - 1;
		let day: number = new Date(year, month, 1).getDay();
		return day === 0 ? 6 : day - 1;
	}

	private createDaysButtons(): React.JSX.Element[] {
		let rows: Array<React.JSX.Element> = new Array<React.JSX.Element>();
		let days: Array<React.JSX.Element> = new Array<React.JSX.Element>();

		let daysInMonth: number = this.daysInMonth(this.state.currentYear, this.state.currentMonth);
		let firstDay: number = this.getFirstDayInWeekOfMonth(this.state.currentYear, this.state.currentMonth);
		for (let i: number = 0; days.length !== firstDay; i++) {
			days.push(<View style={{ flex: 100 / 7, padding: 5 }}></View>);
		}

		for (let i: number = 0; i < daysInMonth; i++) {
			if (days.length > 6) {
				rows.push(<View style={rowStyle}>{days}</View>);
				days = new Array<React.JSX.Element>();
			}
			days.push(
				<View key={i} style={{ flex: 100 / 7, padding: 5 }}>
					<Button compact={true} onPress={() => console.log(i + 1)}>
						{i + 1}
					</Button>
				</View>
			);
		}

		for (let i = 0; days.length !== 7; i++) {
			days.push(<View key={i} style={{ flex: 100 / 7, padding: 5 }}></View>);
		}
		rows.push(<View style={rowStyle}>{days}</View>);

		return rows;
	}

	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal visible={this.props.visible} style={modalStyle} onDismiss={() => this.onDismiss()}>
					<View style={mainViewStyle}>
						<Text style={{ textAlign: 'left', width: '100%' }}>Select date</Text>

						<View style={{ flexDirection: 'row', gap: 16 }}>
							<Text variant={'titleLarge'} style={{ marginBottom: 'auto', marginTop: 'auto', textAlignVertical: 'center' }}>
								{this.dateFormatter(this.state.selectedTimeStart)} - {this.dateFormatter(this.state.selectedTimeEnd)}
							</Text>
							<IconButton icon={'pencil'} style={{ left: 16 }} onPress={() => null} />
						</View>

						<View style={rowStyle}>
							{day.map((value, key) => (
								<View key={key} style={{ flex: 100 / 7, padding: 5 }}>
									<Text style={{ textAlign: 'center' }}>{value}</Text>
								</View>
							))}
						</View>
						{this.createDaysButtons()}
					</View>
				</Modal>
			</Portal>
		);
	}
}
export default TimePicker;
