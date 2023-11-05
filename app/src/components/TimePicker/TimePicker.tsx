import React, { Component } from 'react';
import { Modal, Portal, Text, TouchableRipple, Button, IconButton, List } from 'react-native-paper';
import { Dimensions, FlatList, StyleProp, View, ViewStyle, VirtualizedList } from 'react-native';
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
	datePicker: boolean;
}

class TimePicker extends Component<TimePickerProps, TimePickerState> {
	state: TimePickerState = {
		currentMonth: getToday()[1],
		currentYear: getToday()[2],
		selectedTimeStart: getToday(),
		selectedTimeEnd: getToday(),
		activeDay: true,
		landscape: isLandscape(),
		datePicker: true
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
		let buttonStyle: StyleProp<ViewStyle> = {
			padding: 1,
			alignItems: 'center',
			aspectRatio: 1,
			width: `${100 / 7}%`
		};
		let daysButton: Array<React.JSX.Element> = new Array<React.JSX.Element>();
		for (let day of days) {
			daysButton.push(
				<View key={daysButton.length} style={buttonStyle}>
					<Text style={{ textAlign: 'center', width: '100%' }}>{day}</Text>
				</View>
			);
		}

		let amountDaysInMonth: number = daysInMonth(this.state.currentYear, this.state.currentMonth);
		let firstDay: number = getFirstDayInWeekOfMonth(this.state.currentYear, this.state.currentMonth);
		// Push empty elements, so start day is correct
		for (let i: number = 0; daysButton.length - 7 <= firstDay; i++) {
			daysButton.push(<View key={daysButton.length} style={buttonStyle}></View>);
		}

		// Create all the days in the month
		for (let i: number = 0; i < amountDaysInMonth; i++) {
			daysButton.push(
				<View key={daysButton.length} style={buttonStyle}>
					{this.createDayButton(i + 1)}
				</View>
			);
		}

		return daysButton;
	}

	private changeMonth(change: number): void {
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

	private dateSelectorRender(): React.JSX.Element {
		let rowStyle: StyleProp<ViewStyle> = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			flexWrap: 'wrap',
			width: this.state.landscape ? '75%' : '100%',
			height: this.state.landscape ? '100%' : 'auto'
		};

		return (
			<View style={{ padding: 16 }}>
				<View style={rowStyle}>{this.createDaysButtons()}</View>
			</View>
		);
	}

	private menuRender(containerStyle: ViewStyle): React.JSX.Element {
		return (
			<View style={containerStyle}>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Text style={{ textAlign: 'left', width: '100%', paddingHorizontal: 12 }}>Select period</Text>
				</View>

				{this.dateDisplayRender()}
				{this.navigatorRender()}
			</View>
		);
	}

	private navigatorRender(): React.JSX.Element {
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
				<View style={{ width: '50%' }}>
					<Button
						style={{ alignItems: 'baseline' }}
						compact={true}
						icon={'menu-down'}
						textColor={getCurrentTheme().colors?.onSurface}
						contentStyle={{ flexDirection: 'row-reverse' }}
						onPress={() => this.setState({ datePicker: !this.state.datePicker })}
					>
						{fullMonths[this.state.currentMonth - 1]} {this.state.currentYear}
					</Button>
				</View>
				<View
					style={{
						width: '50%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
						marginRight: 0
					}}
				>
					<IconButton size={20} onPress={() => this.changeMonth(-1)} icon={'chevron-left'}></IconButton>
					<IconButton
						size={20}
						style={{ marginRight: 0 }}
						onPress={() => this.changeMonth(1)}
						icon={'chevron-right'}
					></IconButton>
				</View>
			</View>
		);
	}

	private dateDisplayRender(): React.JSX.Element {
		return (
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
			</View>
		);
	}

	private yearSelectorRender() {
		let rowStyle: StyleProp<ViewStyle> = {
			maxHeight: this.state.landscape ? Dimensions.get('screen').height * 0.9 : Dimensions.get('screen').height / 2,
			width: this.state.landscape ? '60%' : '100%',
			padding: 16,
			marginBottom: 16,
			overflow: 'hidden'
		};
		let years: number = new Date(Date.now()).getFullYear() - 1970 + 1;
		let data: number[] = [...Array(years).keys()].reverse();
		return (
			<View style={rowStyle}>
				<FlatList
					data={data}
					numColumns={2}
					initialNumToRender={20}
					renderItem={(info) => {
						return (
							<Button
								style={{ width: '50%' }}
								textColor={getCurrentTheme().colors?.onSurface}
								onPress={() => this.setState({ currentYear: info.item + 1970, datePicker: true })}
							>
								{info.item + 1970}
							</Button>
						);
					}}
				/>
			</View>
		);
	}

	render(): React.JSX.Element {
		let mainViewStyle: StyleProp<ViewStyle> = {
			backgroundColor: getCurrentTheme().colors?.surface,
			padding: 16,
			borderRadius: 30,
			display: 'flex',
			flexDirection: this.state.landscape ? 'column' : 'row',
			flexWrap: 'wrap',
			width: 'auto'
		};

		let containerStyle: StyleProp<ViewStyle> = {
			paddingHorizontal: 16,
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: this.state.landscape ? '40%' : '100%'
		};

		return (
			<Portal>
				<Modal visible={this.props.visible} style={this.modalStyle} onDismiss={() => this.onDismiss()}>
					<View style={mainViewStyle}>
						{this.menuRender(containerStyle)}
						{this.state.datePicker ? this.dateSelectorRender() : this.yearSelectorRender()}
						<View style={{ position: 'absolute', bottom: 16, right: 32 }}>
							<Button onPress={() => this.onDismiss()}>Confirm</Button>
						</View>
					</View>
				</Modal>
			</Portal>
		);
	}
}
export default TimePicker;
