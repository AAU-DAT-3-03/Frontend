import React, { Component } from 'react';
import { Modal, Portal, Text, TouchableRipple, Button, IconButton } from 'react-native-paper';
import { Dimensions, FlatList, ListRenderItemInfo, StyleProp, View, ViewStyle } from 'react-native';
import Color from 'color';
import { getCurrentTheme } from '../../themes/ThemeManager';
import DayPickerButton from './DayPickerButton';
import {
	compareDatesEqual,
	compareDatesLessThanOrEqual,
	dateFormatter,
	daysAbbreviated,
	daysInMonth,
	fullMonths,
	getFirstDayInWeekOfMonth,
	getToday
} from './DateHelper';
import { isLandscape } from '../../utility/ScreenUtility';
import DateInput from './DateInput';

interface TimePickerProps {
	visible: boolean;
	onDismiss?: (date: [[number, number, number], [number, number, number]]) => void;
	startDate?: [number, number, number];
	endDate?: [number, number, number];
}

enum ScreenSelector {
	DATEPICKER,
	YEARPICKER,
	DATEINPUT
}

enum DateInputField {
	STARTDATE,
	ENDDATE
}

interface TimePickerState {
	currentMonth: number;
	currentYear: number;
	selectedTimeStart: [number, number, number];
	selectedTimeEnd: [number, number, number];
	landscape: boolean;
	screenSelector: ScreenSelector;
	dateInputField: DateInputField;
	inputTargetValue: [number, number, number];
}

class TimePicker extends Component<TimePickerProps, TimePickerState> {
	state: TimePickerState = {
		currentMonth: 0,
		currentYear: 0,
		selectedTimeStart: [0, 0, 0],
		selectedTimeEnd: [0, 0, 0],
		landscape: false,
		screenSelector: ScreenSelector.DATEPICKER,
		dateInputField: DateInputField.STARTDATE,
		inputTargetValue: [0, 0, 0]
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
		let today: [number, number, number] = getToday();
		this.state.selectedTimeStart = this.props.startDate ?? today;
		this.state.selectedTimeEnd = this.props.endDate ?? today;
		this.state.currentMonth = this.state.selectedTimeStart[1];
		this.state.currentYear = this.state.selectedTimeStart[2];
		this.state.landscape = isLandscape();
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			if (width < height) {
				this.setState({ landscape: false });
			} else {
				this.setState({ landscape: true });
			}
		});
	}

	/**
	 * @brief Triggers once timepicker is dismissed. Will trigger the props onDismiss if exists
	 */
	private onDismiss(): void {
		if (this.state.screenSelector === ScreenSelector.DATEINPUT) {
			this.setState({ screenSelector: ScreenSelector.DATEPICKER });
			return;
		}
		if (this.props.onDismiss === undefined) return;
		this.props.onDismiss([this.state.selectedTimeStart, this.state.selectedTimeEnd]);
	}

	/**
	 * @brief Handles when a day button is pressed
	 * @param {[number, number, number]} buttonDay The day of the button that was pressed.
	 */
	private dayButtonOnPress(buttonDay: [number, number, number]): void {
		if (this.state.dateInputField === DateInputField.ENDDATE && compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay)) {
			this.state.selectedTimeEnd = buttonDay;
		} else if (compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd)) {
			this.state.selectedTimeStart = buttonDay;
		} else {
			this.state.selectedTimeEnd = buttonDay;
		}
		this.forceUpdate();
	}

	/**
	 * @brief Creates a single day button
	 * @param {number} day The day to create a button for.
	 * @returns A React.JSX.Element representing the button.
	 */
	private createDayButton(day: number): React.JSX.Element {
		let buttonDay: [number, number, number] = [day, this.state.currentMonth, this.state.currentYear];
		let today: boolean = compareDatesEqual(buttonDay, getToday());
		let isPrimary: boolean =
			(compareDatesEqual(buttonDay, this.state.selectedTimeStart) && this.state.dateInputField === DateInputField.STARTDATE) ||
			(compareDatesEqual(buttonDay, this.state.selectedTimeEnd) && this.state.dateInputField === DateInputField.ENDDATE);
		let isSelected: boolean =
			compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd) &&
			compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay);
		return (
			<DayPickerButton selected={isSelected} primary={isPrimary} today={today} onPress={() => this.dayButtonOnPress(buttonDay)}>
				{day}
			</DayPickerButton>
		);
	}

	/**
	 * @brief Creates all day buttons for a month, including empty space
	 * @returns An array of React.JSX.Element representing the buttons for the days.
	 */
	private createDaysButtons(buttonStyle: StyleProp<ViewStyle>): React.JSX.Element[] {
		let daysButton: React.JSX.Element[] = new Array<React.JSX.Element>();

		let amountDaysInMonth: number = daysInMonth(this.state.currentYear, this.state.currentMonth);
		let firstDay: number = getFirstDayInWeekOfMonth(this.state.currentYear, this.state.currentMonth);
		// Push empty elements, so start day is correct
		for (let i: number = 0; daysButton.length <= firstDay; i++) {
			daysButton.push(<View key={daysButton.length} style={buttonStyle} />);
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

	/**
	 * @brief Changes the month state and ensures correct change
	 * @param {number} change The amount to change the month by.
	 */
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

	/**
	 * @brief Creates the section with all the day buttons
	 * @returns A React.JSX.Element representing the date selector.
	 */
	private dateSelectorRender(): React.JSX.Element {
		let rowStyle: StyleProp<ViewStyle> = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			flexWrap: 'wrap',
			width: this.state.landscape ? '75%' : '100%',
			height: this.state.landscape ? '100%' : 'auto'
		};

		let buttonStyle: StyleProp<ViewStyle> = {
			padding: 1,
			alignItems: 'center',
			aspectRatio: 1,
			width: `${100 / 7}%`
		};

		return (
			<View style={{ padding: 16 }}>
				<View style={rowStyle}>
					{daysAbbreviated.map((value: string, key: number) => (
						<View key={key} style={buttonStyle}>
							<Text style={{ textAlign: 'center', width: '100%' }}>{value}</Text>
						</View>
					))}
					{this.createDaysButtons(buttonStyle)}
				</View>
			</View>
		);
	}

	/**
	 * @brief Creates the section with the menu
	 * @param {ViewStyle} containerStyle The style for the container.
	 * @returns A React.JSX.Element representing the menu.
	 */
	private menuRender(containerStyle: ViewStyle): React.JSX.Element {
		return (
			<View style={containerStyle}>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Text style={{ textAlign: 'left', width: '100%', paddingHorizontal: 12 }}>Select period</Text>
				</View>

				{this.dateDisplayRender()}
				{this.state.screenSelector !== ScreenSelector.DATEINPUT ? this.navigatorRender() : null}
			</View>
		);
	}

	/**
	 * @brief Creates the month and year navigator
	 * @returns A React.JSX.Element representing the navigator.
	 */
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
						onPress={() =>
							this.setState({
								screenSelector:
									this.state.screenSelector !== ScreenSelector.YEARPICKER
										? ScreenSelector.YEARPICKER
										: ScreenSelector.DATEPICKER
							})
						}
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
					<IconButton size={20} onPress={() => this.changeMonth(-1)} icon={'chevron-left'} />
					<IconButton size={20} style={{ marginRight: 0 }} onPress={() => this.changeMonth(1)} icon={'chevron-right'} />
				</View>
			</View>
		);
	}

	/**
	 * @brief Creates the section showing the 2 dates selected
	 * @returns A React.JSX.Element representing the date display.
	 */
	private dateDisplayRender(): React.JSX.Element {
		return (
			<View style={{ flexDirection: 'row', gap: 16, justifyContent: 'space-evenly' }}>
				<TouchableRipple
					style={this.state.dateInputField === DateInputField.STARTDATE ? this.dateActiveStyle : this.dateStyle}
					rippleColor={Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string()}
					onPress={() =>
						this.setState({
							dateInputField: DateInputField.STARTDATE,
							currentMonth: this.state.selectedTimeStart[1],
							currentYear: this.state.selectedTimeStart[2],
							inputTargetValue: this.state.selectedTimeStart
						})
					}
					onLongPress={() => {
						this.setState({
							dateInputField: DateInputField.STARTDATE,
							screenSelector: ScreenSelector.DATEINPUT,
							inputTargetValue: this.state.selectedTimeStart
						});
					}}
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
					style={this.state.dateInputField === DateInputField.ENDDATE ? this.dateActiveStyle : this.dateStyle}
					rippleColor={Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string()}
					onPress={() =>
						this.setState({
							dateInputField: DateInputField.ENDDATE,
							currentMonth: this.state.selectedTimeEnd[1],
							currentYear: this.state.selectedTimeEnd[2],
							inputTargetValue: this.state.selectedTimeEnd
						})
					}
					onLongPress={() => {
						this.setState({
							dateInputField: DateInputField.ENDDATE,
							screenSelector: ScreenSelector.DATEINPUT,
							inputTargetValue: this.state.selectedTimeEnd
						});
					}}
					borderless={true}
				>
					<Text variant={'titleLarge'} style={{ marginBottom: 'auto', marginTop: 'auto', textAlignVertical: 'center' }}>
						{dateFormatter(this.state.selectedTimeEnd)}
					</Text>
				</TouchableRipple>
			</View>
		);
	}

	/**
	 * @brief Create the section showing a list of years
	 * @returns A React.JSX.Element representing the year selector.
	 */
	private yearSelectorRender(): React.JSX.Element {
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
					renderItem={(info: ListRenderItemInfo<number>) => {
						return (
							<Button
								style={{ width: '50%' }}
								textColor={getCurrentTheme().colors?.onSurface}
								onPress={() => this.setState({ currentYear: info.item + 1970, screenSelector: ScreenSelector.DATEPICKER })}
							>
								{info.item + 1970}
							</Button>
						);
					}}
				/>
			</View>
		);
	}

	private dateInputRender(): React.JSX.Element {
		return (
			<View style={{ padding: 16, width: '100%', marginBottom: 16 }}>
				<DateInput
					value={this.state.inputTargetValue}
					onChange={(date: [number, number, number]) => {
						if (this.state.dateInputField === DateInputField.STARTDATE) {
							this.setState({ selectedTimeStart: date });
						} else {
							this.setState({ selectedTimeEnd: date });
						}
					}}
				/>
			</View>
		);
	}

	/**
	 * @brief Main render function for the component
	 * @returns A React.JSX.Element representing the TimePicker component.
	 */
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

		let screen: () => React.JSX.Element;
		switch (this.state.screenSelector) {
			case ScreenSelector.DATEINPUT:
				screen = this.dateInputRender.bind(this);
				break;
			case ScreenSelector.DATEPICKER:
				screen = this.dateSelectorRender.bind(this);
				break;
			case ScreenSelector.YEARPICKER:
				screen = this.yearSelectorRender.bind(this);
				break;
		}

		return (
			<Portal>
				<Modal visible={this.props.visible} style={this.modalStyle} onDismiss={() => this.onDismiss()}>
					<View style={mainViewStyle}>
						{this.menuRender(containerStyle)}
						{screen()}
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
