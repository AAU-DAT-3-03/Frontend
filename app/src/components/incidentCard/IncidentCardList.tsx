import { AlarmResponse } from '../../utility/DataHandlerTypes';
import React, { Component } from 'react';
import { Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';

interface IncidentCardListItemProps {
	alarm: AlarmResponse;
	alternate: boolean;
	onClickAlarm: (id: string) => void;
}

/**
 * The individual items in the list for IncidentCardList
 */
export class IncidentCardListItem extends Component<IncidentCardListItemProps> {
	render(): React.JSX.Element {
		return (
			<TouchableRipple onPress={() => this.props.onClickAlarm(this.props.alarm.id)} borderless={true}>
				<View style={this.props.alternate ? incidentCardStyle().listItemAlternate : incidentCardStyle().listItem}>
					<Text>
						{this.props.alarm.serviceName} - {this.props.alarm.name}
					</Text>
				</View>
			</TouchableRipple>
		);
	}
}
interface IncidentCardListProps {
	alarms: AlarmResponse[];
	onClickAlarm: (id: string, alarm: AlarmResponse) => void;
}

/**
 * Creates the list of alarms for an IncidentCard
 */
class IncidentCardList extends Component<IncidentCardListProps> {
	render(): React.JSX.Element {
		return (
			<View style={incidentCardStyle().listWrapper}>
				{this.props.alarms !== undefined
					? this.props.alarms.map((alarm: AlarmResponse, key: number) => (
							<IncidentCardListItem
								key={key}
								alarm={alarm}
								alternate={key % 2 === 0}
								onClickAlarm={(id: string) => this.props.onClickAlarm(id, alarm)}
							/>
					  ))
					: null}
			</View>
		);
	}
}

const incidentCardStyle = () => {
	return StyleSheet.create({
		headerContainer: {
			paddingTop: 4,
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		headerRipple: {
			borderRadius: 16
		},
		headerSection: {
			flexShrink: 2,
			overflow: 'hidden',
			paddingLeft: 4,
			flexDirection: 'row',
			alignItems: 'center'
		},
		list: {
			width: '100%'
		},
		listItem: {
			backgroundColor: getCurrentTheme().colors.elevation.level2,
			padding: 16,
			width: '100%'
		},
		listItemAlternate: {
			backgroundColor: getCurrentTheme().colors.elevation.level4,
			padding: 16,
			width: '100%'
		},
		listWrapper: {
			borderBottomRightRadius: 16,
			borderBottomLeftRadius: 16,
			overflow: 'hidden'
		}
	});
};

export default IncidentCardList;
