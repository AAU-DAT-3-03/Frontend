import React, { Component, createRef } from 'react';
import { Modal, Portal, Text, TouchableRipple, Button, IconButton } from 'react-native-paper';
import { Dimensions, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
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
import DatePicker from 'react-native-date-picker';

export type PickerDate = [number, number, number];

interface TimePickerProps {
	visible: boolean;
	onDismiss?: (date: [PickerDate, PickerDate]) => void;
	startDate?: PickerDate;
	endDate?: PickerDate;
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
	selectedTimeStart: PickerDate;
	selectedTimeEnd: PickerDate;
	landscape: boolean;
	screenSelector: ScreenSelector;
	dateInputField: DateInputField;
	inputRef: React.RefObject<DateInput>;
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
		inputRef: createRef<DateInput>()
	};

	constructor(props: TimePickerProps) {
		super(props);
		let today: PickerDate = getToday();
		this.state.currentMonth = today[1];
		this.state.currentYear = today[2];
		this.state.selectedTimeStart = props.startDate ?? today;
		this.state.selectedTimeEnd = props.endDate ?? today;
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
	 * @param {PickerDate} buttonDay The day of the button that was pressed.
	 */
	private dayButtonOnPress(buttonDay: PickerDate): void {
		if (this.state.dateInputField === DateInputField.ENDDATE && compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay)) {
			this.setState({ selectedTimeEnd: buttonDay });
		} else if (compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd)) {
			this.setState({ selectedTimeStart: buttonDay });
		} else {
			this.setState({ selectedTimeEnd: buttonDay });
		}
	}

	/**
	 * @brief Creates a single day button
	 * @param {number} day The day to create a button for.
	 * @returns A React.JSX.Element representing the button.
	 */
	private createDayButton(day: number): React.JSX.Element {
		let buttonDay: PickerDate = [day, this.state.currentMonth, this.state.currentYear];
		let today: boolean = compareDatesEqual(buttonDay, getToday());
		let isPrimary: boolean =
			(compareDatesEqual(buttonDay, this.state.selectedTimeStart) && this.state.dateInputField === DateInputField.STARTDATE) ||
			(compareDatesEqual(buttonDay, this.state.selectedTimeEnd) && this.state.dateInputField === DateInputField.ENDDATE);
		let isSelected: boolean =
			compareDatesLessThanOrEqual(buttonDay, this.state.selectedTimeEnd) &&
			compareDatesLessThanOrEqual(this.state.selectedTimeStart, buttonDay);
		return (
			<DayPickerButton
				disabled={!compareDatesLessThanOrEqual(buttonDay, getToday())}
				selected={isSelected}
				primary={isPrimary}
				today={today}
				onPress={() => this.dayButtonOnPress(buttonDay)}
			>
				{day}
			</DayPickerButton>
		);
	}

	/**
	 * @brief Creates all day buttons for a month, including empty space
	 * @returns An array of React.JSX.Element representing the buttons for the days.
	 */
	private createDaysButtons(buttonStyle: StyleProp<ViewStyle>): React.JSX.Element[] {
		let daysButton: React.JSX.Element[] = [];

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
		if (newMonth > getToday()[1]) return;
		this.setState({ currentMonth: newMonth });
	}

	/**
	 * @brief Creates the section with all the day buttons
	 * @returns A React.JSX.Element representing the date selector.
	 */
	private dateSelectorRender(): React.JSX.Element {
		let rowStyle: StyleProp<ViewStyle> = {
			...timePickerStyleSheet().dateSelectorRow,
			width: this.state.landscape ? '75%' : '100%',
			height: this.state.landscape ? '100%' : 'auto'
		};

		return (
			<View style={timePickerStyleSheet().dateSelectorWrapper}>
				<View style={rowStyle}>
					{daysAbbreviated.map((value: string, key: number) => (
						<View key={key} style={timePickerStyleSheet().dateSelectorButtonStyle}>
							<Text style={timePickerStyleSheet().dateSelectorText}>{value}</Text>
						</View>
					))}
					{this.createDaysButtons(timePickerStyleSheet().dateSelectorButtonStyle)}
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
				<View style={timePickerStyleSheet().menuRenderTextWrapper}>
					<Text style={timePickerStyleSheet().menuRenderText}>Select period</Text>
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
			<View style={timePickerStyleSheet().navigatorRenderWrapper}>
				<View style={timePickerStyleSheet().halfWidth}>
					<Button
						style={timePickerStyleSheet().navigatorRenderButton}
						compact={true}
						icon={'menu-down'}
						textColor={getCurrentTheme().colors?.onSurface}
						contentStyle={timePickerStyleSheet().flexReverse}
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
				<View style={timePickerStyleSheet().monthPickerContainer}>
					<IconButton size={20} onPress={() => this.changeMonth(-1)} icon={'chevron-left'} />
					<IconButton
						size={20}
						style={timePickerStyleSheet().noRightMargin}
						onPress={() => this.changeMonth(1)}
						icon={'chevron-right'}
					/>
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
			<View style={timePickerStyleSheet().dateDisplayWrapper}>
				{this.singleDateDisplayRender(
					this.state.selectedTimeStart,
					this.state.dateInputField === DateInputField.STARTDATE,
					this.onPressStartDate.bind(this),
					this.onLongPressStartDate.bind(this)
				)}

				<Text variant={'titleLarge'} style={timePickerStyleSheet().dateDisplayDashText}>
					-
				</Text>

				{this.singleDateDisplayRender(
					this.state.selectedTimeEnd,
					this.state.dateInputField === DateInputField.ENDDATE,
					this.onPressEndDate.bind(this),
					this.onLongPressEndDate.bind(this)
				)}
			</View>
		);
	}

	private singleDateDisplayRender(date: PickerDate, active: boolean, onPress: () => void, onLongPress: () => void): React.JSX.Element {
		return (
			<TouchableRipple
				style={active ? timePickerStyleSheet().dateActiveStyle : timePickerStyleSheet().dateStyle}
				rippleColor={Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string()}
				onPress={() => onPress()}
				onLongPress={() => onLongPress()}
				borderless={true}
			>
				<Text variant={'titleLarge'} style={timePickerStyleSheet().dateDisplayDashText}>
					{dateFormatter(date)}
				</Text>
			</TouchableRipple>
		);
	}

	private onPressStartDate(): void {
		this.setState({
			dateInputField: DateInputField.STARTDATE,
			currentMonth: this.state.selectedTimeStart[1],
			currentYear: this.state.selectedTimeStart[2]
		});
		this.state.inputRef.current?.setState({ text: DateInput.dateFormatter(this.state.selectedTimeStart) });
	}

	private onLongPressStartDate(): void {
		this.setState({
			dateInputField: DateInputField.STARTDATE,
			screenSelector: ScreenSelector.DATEINPUT
		});
	}

	private onPressEndDate(): void {
		this.setState({
			dateInputField: DateInputField.ENDDATE,
			currentMonth: this.state.selectedTimeEnd[1],
			currentYear: this.state.selectedTimeEnd[2]
		});
		this.state.inputRef.current?.setState({ text: DateInput.dateFormatter(this.state.selectedTimeEnd) });
	}

	private onLongPressEndDate(): void {
		this.setState({
			dateInputField: DateInputField.ENDDATE,
			screenSelector: ScreenSelector.DATEINPUT
		});
	}

	/**
	 * @brief Create the section showing a list of years
	 * @returns A React.JSX.Element representing the year selector.
	 */
	private yearSelectorRender(): React.JSX.Element {
		let rowStyle: StyleProp<ViewStyle> = {
			...timePickerStyleSheet().rowStyle,
			flexDirection: 'row',
			maxHeight: this.state.landscape ? Dimensions.get('screen').height * 0.9 : Dimensions.get('screen').height / 2,
			width: this.state.landscape ? '60%' : '100%'
		};
		let years: number = new Date(Date.now()).getFullYear() - 2002 + 1;
		let data: number[] = [...Array(years).keys()].reverse();
		return (
			<View style={rowStyle}>
				<FlatList
					style={timePickerStyleSheet().halfWidth}
					data={data}
					numColumns={1}
					initialNumToRender={20}
					showsVerticalScrollIndicator={false}
					renderItem={(info: ListRenderItemInfo<number>) => this.yearButtonRender(info)}
				/>
				<FlatList
					style={timePickerStyleSheet().halfWidth}
					data={fullMonths}
					numColumns={1}
					initialNumToRender={20}
					showsVerticalScrollIndicator={false}
					renderItem={(info: ListRenderItemInfo<string>) => (
						<Button
							textColor={getCurrentTheme().colors?.onSurface}
							onPress={() =>
								this.setState({
									currentMonth: info.index + 1,
									screenSelector: ScreenSelector.DATEPICKER
								})
							}
						>
							{info.item}
						</Button>
					)}
				/>
			</View>
		);
	}

	private yearButtonRender(info: ListRenderItemInfo<number>) {
		return (
			<Button
				textColor={getCurrentTheme().colors?.onSurface}
				onPress={() =>
					this.setState({
						currentYear: info.item + 2002,
						screenSelector: ScreenSelector.DATEPICKER
					})
				}
			>
				{info.item + 2002}
			</Button>
		);
	}

	private dateInputRender(): React.JSX.Element {
		let value: PickerDate =
			this.state.dateInputField === DateInputField.STARTDATE ? this.state.selectedTimeStart : this.state.selectedTimeEnd;
		let date: Date = new Date(`${value[2]}-${value[1]}-${value[0]}`);
		return (
			<View style={timePickerStyleSheet().dateInputWrapper}>
				<DatePicker
					androidVariant={'nativeAndroid'}
					mode={'date'}
					maximumDate={new Date(Date.now())}
					minimumDate={new Date('2002-01-01T01:00:00')}
					date={date}
					onDateChange={(changedDate: Date) =>
						this.dayButtonOnPress([changedDate.getDate(), changedDate.getMonth() + 1, changedDate.getFullYear()])
					}
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
			...timePickerStyleSheet().mainViewStyle,
			flexDirection: this.state.landscape ? 'column' : 'row'
		};

		let containerStyle: StyleProp<ViewStyle> = {
			...timePickerStyleSheet().containerStyle,
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
				<Modal visible={this.props.visible} style={timePickerStyleSheet().modalStyle} onDismiss={() => this.onDismiss()}>
					<View style={mainViewStyle}>
						{this.menuRender(containerStyle)}
						{screen()}
						<View style={timePickerStyleSheet().confirmButton}>
							<Button onPress={() => this.onDismiss()}>Confirm</Button>
						</View>
					</View>
				</Modal>
			</Portal>
		);
	}
}

const timePickerStyleSheet = () => {
	return StyleSheet.create({
		mainViewStyle: {
			backgroundColor: getCurrentTheme().colors?.surface,
			padding: 16,
			borderRadius: 30,
			display: 'flex',
			flexWrap: 'wrap',
			width: 'auto'
		},
		containerStyle: {
			paddingHorizontal: 16,
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		},
		confirmButton: {
			position: 'absolute',
			bottom: 16,
			right: 32
		},
		rowStyle: {
			padding: 16,
			marginBottom: 16,
			overflow: 'hidden'
		},
		monthPickerContainer: {
			width: '50%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginRight: 0
		},
		dateSelectorRow: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			flexWrap: 'wrap'
		},
		dateSelectorButtonStyle: {
			padding: 1,
			alignItems: 'center',
			aspectRatio: 1,
			width: `${100 / 7}%`
		},
		modalStyle: {
			backgroundColor: undefined,
			position: 'absolute',
			padding: 16,
			justifyContent: 'center'
		},

		dateStyle: {
			padding: 10,
			borderRadius: 100,
			borderColor: getCurrentTheme().colors?.onSurface,
			borderWidth: 2
		},
		dateActiveStyle: {
			padding: 10,
			borderRadius: 100,
			borderColor: getCurrentTheme().colors?.onSurface,
			borderWidth: 2,
			backgroundColor: getCurrentTheme().colors.tertiary
		},
		dateSelectorWrapper: {
			padding: 16
		},
		dateSelectorText: {
			textAlign: 'center',
			width: '100%'
		},
		menuRenderTextWrapper: {
			flexDirection: 'row',
			gap: 8
		},
		menuRenderText: {
			textAlign: 'left',
			width: '100%',
			paddingHorizontal: 12
		},
		navigatorRenderWrapper: {
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			width: '100%'
		},
		halfWidth: {
			width: '50%'
		},
		navigatorRenderButton: {
			alignItems: 'baseline'
		},
		flexReverse: {
			flexDirection: 'row-reverse'
		},
		noRightMargin: {
			marginRight: 0
		},
		dateDisplayWrapper: {
			flexDirection: 'row',
			gap: 16,
			justifyContent: 'space-evenly'
		},
		dateDisplayDashText: {
			marginBottom: 'auto',
			marginTop: 'auto',
			textAlignVertical: 'center'
		},
		dateInputWrapper: {
			padding: 16,
			width: '100%',
			marginBottom: 16
		}
	});
};

export default TimePicker;
