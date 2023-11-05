import React, { Component } from 'react';
import { Modal, Portal, Text, TouchableRipple, Button, IconButton } from 'react-native-paper';
import { Dimensions, StyleProp, View, ViewStyle } from 'react-native';
import Color from 'color';
import { getCurrentTheme } from '../../themes/ThemeManager';
import DayPickerButton from './DayPickerButton';
import {
	compareDatesEqual,
	compareDatesLessThanOrEqual,
	dateFormatter,
	days,
	daysInMonth,
	fullMonths,
	getFirstDayInWeekOfMonth,
	getToday
} from './DateHelper';
import { isLandscape } from '../../utility/ScreenUtility';

interface TimePickerProps {
	visible: boolean;
	onDismiss?: (date: [[number, number, number], [number, number, number]]) => void;
}

interface TimePickerState {
	currentMonth: number;
	currentYear: number;
	selectedTimeStart: [number, number, number];
	selectedTimeEnd: [number, number, number];
	activeDay: boolean;
	landscape: boolean;
}

class TimePicker extends Component<TimePickerProps, TimePickerState> {
	state: TimePickerState = {
		currentMonth: getToday()[1],
		currentYear: getToday()[2],
		selectedTimeStart: getToday(),
		selectedTimeEnd: getToday(),
		activeDay: true,
		landscape: isLandscape()
	};

	modalStyle: StyleProp<ViewStyle> = {
		backgroundColor: undefined,
		position: 'absolute',
		padding: 16,
		justifyContent: 'center'
	};

	dateStyle: StyleProp<ViewStyle> = {
		padding: 10,
		borderRadius: 100,
		borderColor: getCurrentTheme().colors?.surface,
		borderWidth: 2
	};

	dateActiveStyle: StyleProp<ViewStyle> = {
		padding: 10,
		borderRadius: 100,
		borderColor: getCurrentTheme().colors?.onSurface,
		borderWidth: 2
	};

	constructor(props: TimePickerProps) {
		super(props);
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			if (width < height) {
				this.setState({ landscape: false });
			} else {
				this.setState({ landscape: true });
			}
		});
	}

	private onDismiss(): void {
		if (this.props.onDismiss === undefined) return;
		this.props.onDismiss([this.state.selectedTimeStart, this.state.selectedTimeEnd]);
	}

	private dayButtonOnPress(buttonDay: [number, number, number]) {
		if (this.state.activeDay && compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay)) {
			this.state.selectedTimeEnd = buttonDay;
		} else if (compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd)) {
			this.state.selectedTimeStart = buttonDay;
		} else {
			this.state.selectedTimeEnd = buttonDay;
		}
		this.forceUpdate();
	}

	private createDayButton(day: number): React.JSX.Element {
		let buttonDay: [number, number, number] = [day, this.state.currentMonth, this.state.currentYear];
		let today: boolean = compareDatesEqual(buttonDay, getToday());
		let isPrimary: boolean =
			(compareDatesEqual(buttonDay, this.state.selectedTimeStart) && !this.state.activeDay) ||
			(compareDatesEqual(buttonDay, this.state.selectedTimeEnd) && this.state.activeDay);
		let isSelected: boolean =
			compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd) &&
			compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay);
		return (
			<DayPickerButton selected={isSelected} primary={isPrimary} today={today} onPress={() => this.dayButtonOnPress(buttonDay)}>
				{day}
			</DayPickerButton>
		);
	}

	private createDaysButtons(): React.JSX.Element[] {
		let rowStyle: StyleProp<ViewStyle> = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			flexWrap: 'wrap',
			width: this.state.landscape ? '50%' : '100%'
		};

		let rows: Array<React.JSX.Element> = new Array<React.JSX.Element>();
		let daysButton: Array<React.JSX.Element> = new Array<React.JSX.Element>();

		rows.push(
			<View style={rowStyle}>
				{days.map((value, key) => (
					<View key={key} style={{ flex: 100 / 7, paddingBottom: 10 }}>
						<Text style={{ textAlign: 'center', width: '100%' }}>{value}</Text>
					</View>
				))}
			</View>
		);

		let amountDaysInMonth: number = daysInMonth(this.state.currentYear, this.state.currentMonth);
		let firstDay: number = getFirstDayInWeekOfMonth(this.state.currentYear, this.state.currentMonth);
		// Push empty elements, so start day is correct
		for (let i: number = 0; daysButton.length !== firstDay; i++) {
			daysButton.push(<View style={{ flex: 100 / 7, padding: 5 }}></View>);
		}

		// Create all the days in the month
		for (let i: number = 0; i < amountDaysInMonth; i++) {
			if (daysButton.length > 6) {
				rows.push(<View style={rowStyle}>{daysButton}</View>);
				daysButton = new Array<React.JSX.Element>();
			}
			daysButton.push(
				<View key={i} style={{ flex: 100 / 7, padding: 5, alignItems: 'center' }}>
					{this.createDayButton(i + 1)}
				</View>
			);
		}

		// Push empty elements to fill last row
		for (let i = 0; daysButton.length !== 7; i++) {
			daysButton.push(<View key={i} style={{ flex: 100 / 7, padding: 5 }}></View>);
		}
		rows.push(<View style={rowStyle}>{daysButton}</View>);

		return rows;
	}

	private changeMonth(change: number) {
		let newMonth = this.state.currentMonth + change;
		if (newMonth < 1) {
			this.state.currentYear = this.state.currentYear - 1;
			newMonth = 12;
		} else if (newMonth > 12) {
			this.state.currentYear = this.state.currentYear + 1;
			newMonth = 1;
		}
		this.setState({ currentMonth: newMonth });
	}

	render(): React.JSX.Element {
		let mainViewStyle: StyleProp<ViewStyle> = {
			backgroundColor: getCurrentTheme().colors?.surface,
			padding: 16,
			borderRadius: 30,
			display: 'flex',
			flexDirection: this.state.landscape ? 'column' : 'row',
			flexWrap: 'wrap',
			width: 'auto',
			height: 'auto'
		};

		let containerStyle: StyleProp<ViewStyle> = {
			padding: 16,
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: this.state.landscape ? '50%' : '100%'
		};

		return (
			<Portal>
				<Modal visible={this.props.visible} style={this.modalStyle} onDismiss={() => this.onDismiss()}>
					<View style={mainViewStyle}>
						{this.menuRender(containerStyle)}
						{this.dateSelectorRender()}
					</View>
				</Modal>
			</Portal>
		);
	}

	private dateSelectorRender() {
		return (
			<View style={{ padding: 16 }}>
				{this.createDaysButtons()}
				<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
					<Button onPress={() => this.onDismiss()}>Confirm</Button>
				</View>
			</View>
		);
	}

	private menuRender(containerStyle: ViewStyle) {
		return (
			<View style={containerStyle}>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Text style={{ textAlign: 'left', width: '100%', paddingHorizontal: 12 }}>Select period</Text>
				</View>

				<View style={{ flexDirection: 'row', gap: 16, justifyContent: 'space-evenly' }}>
					<TouchableRipple
						style={!this.state.activeDay ? this.dateActiveStyle : this.dateStyle}
						rippleColor={Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string()}
						onPress={() => this.setState({ activeDay: false })}
						borderless={true}
					>
						<Text variant={'titleLarge'} style={{ marginBottom: 'auto', marginTop: 'auto', textAlignVertical: 'center' }}>
							{dateFormatter(this.state.selectedTimeStart)}
						</Text>
					</TouchableRipple>

					<Text variant={'titleLarge'} style={{ marginBottom: 'auto', marginTop: 'auto', textAlignVertical: 'center' }}>
						-
					</Text>
					<TouchableRipple
						style={this.state.activeDay ? this.dateActiveStyle : this.dateStyle}
						rippleColor={Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string()}
						onPress={() => this.setState({ activeDay: true })}
						borderless={true}
					>
						<Text variant={'titleLarge'} style={{ marginBottom: 'auto', marginTop: 'auto', textAlignVertical: 'center' }}>
							{dateFormatter(this.state.selectedTimeEnd)}
						</Text>
					</TouchableRipple>
					{/*<IconButton icon={'pencil'} onPress={() => null} />*/}
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<View style={{ width: '49%' }}>
						<Button
							style={{ alignItems: 'baseline' }}
							compact={true}
							icon={'menu-down'}
							textColor={getCurrentTheme().colors?.onSurface}
							contentStyle={{ flexDirection: 'row-reverse' }}
						>
							{fullMonths[this.state.currentMonth - 1]} {this.state.currentYear}
						</Button>
					</View>
					<View style={{ width: '49%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
						<IconButton size={20} onPress={() => this.changeMonth(-1)} icon={'chevron-left'}></IconButton>
						<IconButton size={20} onPress={() => this.changeMonth(1)} icon={'chevron-right'}></IconButton>
					</View>
				</View>
			</View>
		);
	}
}
export default TimePicker;
