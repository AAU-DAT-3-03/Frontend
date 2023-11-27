import React, { Component } from 'react';
import { IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import StatusIcon, { IncidentState } from '../StatusIcon';
import UserAvatar from './UserAvatar';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../ContainerCard';
import { User } from '../AddUser';

export type Alarm = {
	alarmError: string;
	alarmLog: string;
	alarmNote: string;
	service: string;
	id: number;
};

export type EventLog = {
	dateTime: number;
	user: string;
	message: string;
};

export type IncidentType = {
	id: number;
	companyId: number;
	company: string;
	priority: number;
	caseNr: number;
	incidentNote: string;
	startTime: number;
	alarms: Alarm[];
	assignedUsers: User[];
	calledUsers: User[];
	eventLog: EventLog[];
	state: IncidentState;
};

interface IncidentCardHeaderProps {
	collapsed: boolean;
	onClickButton?: () => void;
	onClickIncident: () => void;
	company: string;
	case: number;
	users: User[];
	status: IncidentState;
	priority: number;
}

interface UserListProps {
	users?: User[];
	visible: boolean;
	onDismiss: () => void;
}

const PriorityColor = (priority: number) => {
	switch (priority) {
		case 1:
			return '#B80000';
		case 2:
			return '#FF511A';
		case 3:
			return '#FF9416';
		case 4:
			return '#FFD66C';
		default:
			return 'transparent';
	}
};

class UserList extends Component<UserListProps> {
	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: undefined,
						position: 'absolute'
					}}
					visible={this.props.visible}
					onDismiss={() => this.props.onDismiss()}
				>
					<View style={{ backgroundColor: getCurrentTheme().colors.surface, borderRadius: 20, padding: 16, gap: 16 }}>
						{this.props.users?.map((value, key) => {
							return <UserAvatar key={key} name={value.name} />;
						})}
					</View>
				</Modal>
			</Portal>
		);
	}
}

export class IncidentCardHeader extends Component<IncidentCardHeaderProps> {
	state = {
		usersVisible: false
	};
	render(): React.JSX.Element {
		let outerContainer: StyleProp<ViewStyle> = { flexGrow: 2 };
		if (this.props.onClickButton !== undefined) {
			outerContainer = {
				...outerContainer,
				borderBottomWidth: this.props.collapsed ? 0 : 0.5,
				borderBottomColor: getCurrentTheme().colors.onSurface,
				paddingBottom: 16,
				paddingHorizontal: 12
			};
		}

		let icon: string = this.props.collapsed ? 'menu-down' : 'menu-up';
		return (
			<View style={outerContainer}>
				<UserList
					visible={this.state.usersVisible}
					users={this.props.users}
					onDismiss={() => this.setState({ usersVisible: false })}
				/>
				<TouchableRipple style={incidentCardStyle().headerRipple} onPress={() => this.props.onClickIncident()} borderless={true}>
					<View style={incidentCardStyle().headerContainer}>
						<View style={incidentCardStyle().headerSection}>
							<View style={{ marginRight: 16 }}>
								<StatusIcon status={this.props.status} />
							</View>
							<View>
								<Text variant={'titleMedium'}>
									{this.props.company} #{this.props.case}
								</Text>
								<Text style={{ color: PriorityColor(this.props.priority) }} variant={'bodyMedium'}>
									{' '}
									Priority {this.props.priority}
								</Text>
							</View>
						</View>
						<View style={incidentCardStyle().headerSection}>
							<View>
								{this.props.users?.length === 0 ? null : (
									<UserAvatar
										onPress={() => {
											this.setState({ usersVisible: true });
										}}
										name={`${this.props.users[0].name}${
											this.props.users.length > 1 ? ` +${this.props.users.length - 1}` : ''
										}`}
									/>
								)}
							</View>
							{this.props.onClickButton !== undefined ? (
								<View>
									<IconButton
										icon={icon}
										onPress={() => {
											if (this.props.onClickButton !== undefined) this.props.onClickButton();
										}}
									/>
								</View>
							) : null}
						</View>
					</View>
				</TouchableRipple>
			</View>
		);
	}
}

interface IncidentCardListItemProps {
	alarm: Alarm;
	alternate: boolean;
	onClickAlarm: (id: number) => void;
}

class IncidentCardListItem extends Component<IncidentCardListItemProps> {
	render(): React.JSX.Element {
		return (
			<TouchableRipple onPress={() => this.props.onClickAlarm(this.props.alarm.id)} borderless={true}>
				<View style={this.props.alternate ? incidentCardStyle().listItemAlternate : incidentCardStyle().listItem}>
					<Text>{this.props.alarm.alarmError}</Text>
				</View>
			</TouchableRipple>
		);
	}
}
interface IncidentCardListProps {
	alarms: Alarm[];
	onClickAlarm: (id: number) => void;
}

export class IncidentCardList extends Component<IncidentCardListProps> {
	render(): React.JSX.Element {
		return (
			<View style={{ borderBottomRightRadius: 16, borderBottomLeftRadius: 16, overflow: 'hidden' }}>
				{this.props.alarms.map((alarm: Alarm, key: number) => (
					<IncidentCardListItem
						key={key}
						alarm={alarm}
						alternate={key % 2 === 0}
						onClickAlarm={(id: number) => this.props.onClickAlarm(id)}
					/>
				))}
			</View>
		);
	}
}

interface IncidentCardProps {
	incident: IncidentType;
	onClickIncident: (id: number) => void;
	onClickAlarm: (id: number) => void;
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
			<ContainerCard style={{ paddingBottom: 0 }}>
				<ContainerCard.Content>
					<IncidentCardHeader
						priority={this.props.incident.priority}
						collapsed={this.state.collapsed}
						onClickButton={() => this.setState({ collapsed: !this.state.collapsed })}
						company={this.props.incident.company}
						case={this.props.incident.caseNr}
						users={this.props.incident.assignedUsers}
						status={this.props.incident.state}
						onClickIncident={() => this.props.onClickIncident(this.props.incident.id)}
					/>
					<View style={incidentCardStyle().list}>
						{this.state.collapsed ? null : (
							<IncidentCardList
								alarms={this.props.incident.alarms}
								onClickAlarm={(id: number) => this.props.onClickAlarm(id)}
							/>
						)}
					</View>
				</ContainerCard.Content>
			</ContainerCard>
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
		}
	});
};
export default IncidentCard;
