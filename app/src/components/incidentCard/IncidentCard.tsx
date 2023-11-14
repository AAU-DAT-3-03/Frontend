import React, { Component } from 'react';
import { Card, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import StatusIcon, { IncidentState } from '../StatusIcon';
import UserAvatar from './UserAvatar';
import { getCurrentTheme } from '../../themes/ThemeManager';

type User = {
	name: string;
	phoneNr: number;
};

type Alarm = {
	alarmError: string;
	id: number;
};

export type Incident = {
	company: string;
	caseNr: number;
	priority: number;
	state: IncidentState;
	users?: User[];
	alarms: Alarm[];
};

interface IncidentCardHeaderProps {
	collapsed: boolean;
	onClickButton: () => void;
	onClickIncident?: () => void;
	company: string;
	case: number;
	users?: User[];
	status: IncidentState;
}

class IncidentCardHeader extends Component<IncidentCardHeaderProps> {
	render(): React.JSX.Element {
		let headerContainer = {
			...incidentCardStyle().headerContainer,
			borderBottomWidth: this.props.collapsed ? 0 : 0.5,
			paddingBottom: this.props.collapsed ? 0 : 8
		};

		let icon: string = this.props.collapsed ? 'menu-up' : 'menu-down';
		return (
			<View style={headerContainer}>
				<View style={incidentCardStyle().headerSection}>
					<View style={{ marginTop: 5, marginRight: 16 }}>
						<StatusIcon status={this.props.status} />
					</View>
					<View>
						<Text variant={'titleMedium'}>{this.props.company}</Text>
						<Text variant={'bodySmall'}>#{this.props.case}</Text>
					</View>
				</View>
				<View style={incidentCardStyle().headerSection}>
					<View style={{ marginTop: 8 }}>
						{this.props.users === undefined ? null : (
							<UserAvatar
								name={`${this.props.users[0].name}${this.props.users.length > 1 ? ` +${this.props.users.length - 1}` : ''}`}
							/>
						)}
					</View>
					<View style={{ marginTop: -4 }}>
						<IconButton icon={icon} onPress={() => this.props.onClickButton()} />
					</View>
				</View>
			</View>
		);
	}
}

interface IncidentCardListItemProps {
	alarm: Alarm;
	alternate: boolean;
}

class IncidentCardListItem extends Component<IncidentCardListItemProps> {
	render(): React.JSX.Element {
		return (
			<View style={this.props.alternate ? incidentCardStyle().listItemAlternate : incidentCardStyle().listItem}>
				<Text>{this.props.alarm.alarmError}</Text>
			</View>
		);
	}
}

interface IncidentCardListProps {
	alarms: Alarm[];
}

class IncidentCardList extends Component<IncidentCardListProps> {
	render(): React.JSX.Element {
		return (
			<View style={{ borderRadius: 16, overflow: 'hidden', marginTop: 16 }}>
				{this.props.alarms.map((alarm: Alarm, key: number) => (
					<IncidentCardListItem key={key} alarm={alarm} alternate={key % 2 === 0} />
				))}
			</View>
		);
	}
}

interface IncidentCardProps {
	incident: Incident;
}

interface IncidentCardState {
	collapsed: boolean;
}

class IncidentCard extends Component<IncidentCardProps, IncidentCardState> {
	state: IncidentCardState = {
		collapsed: true
	};

	render(): React.JSX.Element {
		return (
			<Card>
				<Card.Content>
					<IncidentCardHeader
						collapsed={this.state.collapsed}
						onClickButton={() => this.setState({ collapsed: !this.state.collapsed })}
						company={this.props.incident.company}
						case={this.props.incident.caseNr}
						users={this.props.incident.users}
						status={this.props.incident.state}
					/>
					<View style={incidentCardStyle().list}>
						{this.state.collapsed ? null : <IncidentCardList alarms={this.props.incident.alarms} />}
					</View>
				</Card.Content>
			</Card>
		);
	}
}

const incidentCardStyle = () => {
	return StyleSheet.create({
		headerContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			borderBottomWidth: 1,
			borderBottomColor: getCurrentTheme().colors.onSurface
		},
		headerSection: {
			flexDirection: 'row'
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
		}
	});
};

export default IncidentCard;
