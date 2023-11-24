import React, { Component } from 'react';
import { Searchbar } from 'react-native-paper';
import TimePicker, { PickerDate } from './TimePicker/TimePicker';
import { compareDatesLessThanOrEqual, getToday } from './TimePicker/DateHelper';
import { getCurrentTheme } from '../themes/ThemeManager';

export type Period = {
	start: PickerDate;
	end: PickerDate;
};

interface SearchBarDateSelectorProps {
	placeholder?: string;
	onChange?: (query: string, period: Period) => void;
}

interface SearchBarDateSelectorState {
	query: string;
	timePickerVisible: boolean;
	startDate: PickerDate;
	endDate: PickerDate;
}

class SearchBarDateSelector extends Component<SearchBarDateSelectorProps, SearchBarDateSelectorState> {
	state: SearchBarDateSelectorState = {
		query: '',
		timePickerVisible: false,
		startDate: getToday(-30),
		endDate: getToday()
	};

	private onChangeSearch(query: string) {
		this.setState({ query: query });
		if (this.props.onChange !== undefined) {
			this.props.onChange(query, { start: this.state.startDate, end: this.state.endDate });
		}
	}

	private async onDismiss(date: [PickerDate, PickerDate]): Promise<void> {
		let today: PickerDate = getToday();
		if (compareDatesLessThanOrEqual(today, date[0])) {
			date[0] = today;
		}
		if (compareDatesLessThanOrEqual(today, date[1])) {
			date[1] = today;
		}
		await this.setState({
			startDate: date[0],
			endDate: date[1],
			timePickerVisible: false
		});
		this.onChangeSearch(this.state.query);
	}

	render(): React.JSX.Element {
		return (
			<>
				<Searchbar
					onIconPress={() => this.setState({ timePickerVisible: true })}
					style={{ backgroundColor: getCurrentTheme().colors.surfaceVariant }}
					icon={'calendar-edit'}
					traileringIcon={'magnify'}
					placeholder={this.props.placeholder ?? 'Search'}
					onChangeText={(query: string) => this.onChangeSearch(query)}
					value={this.state.query}
					onClearIconPress={() => this.onChangeSearch('')}
				/>
				<TimePicker
					visible={this.state.timePickerVisible}
					startDate={this.state.startDate}
					endDate={this.state.endDate}
					onDismiss={(date: [PickerDate, PickerDate]) => this.onDismiss(date)}
				/>
			</>
		);
	}
}

export default SearchBarDateSelector;
