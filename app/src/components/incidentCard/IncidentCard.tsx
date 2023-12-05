import React, { Component } from 'react';
import { IconButton, MD3Theme, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import StatusIcon from '../StatusIcon';
import UserAvatar from './UserAvatar';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../ContainerCard';
import { AlarmResponse, IncidentData, UserResponse } from '../../utility/DataHandlerTypes';
import UserInformation from '../UserInformation';

interface IncidentCardHeaderProps {
	collapsed: boolean;
	onClickButton?: () => void;
	onClickIncident: () => void;
	incident: IncidentData;
}

interface UserListProps {
	users?: UserResponse[];
	visible: boolean;
	onDismiss: () => void;
}

export const PriorityColor = (priority: number): string => {
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

interface UserListState {
	userInfoVisible: boolean;
	selectedUser: UserResponse | undefined;
}

class UserList extends Component<UserListProps, UserListState> {
	state: UserListState = {
		userInfoVisible: false,
		selectedUser: undefined
	};
	render(): React.JSX.Element {
		let style = UserListStyle(getCurrentTheme());
		return (
			<Portal>
				<Modal style={style.modal} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					{this.state.userInfoVisible && this.state.selectedUser !== undefined ? (
						<UserInformation
							user={this.state.selectedUser}
							visible={this.state.userInfoVisible}
							onDismiss={() => this.setState({ userInfoVisible: false })}
						/>
					) : null}
					<View style={style.listContainer}>
						{this.props.users?.map((value, key) => {
							return (
								<UserAvatar
									key={key}
									name={value.name}
									onPress={() => {
										this.setState({ userInfoVisible: true, selectedUser: value });
									}}
								/>
							);
						})}
					</View>
				</Modal>
			</Portal>
		);
	}
}

const UserListStyle = (theme: MD3Theme) => {
	return StyleSheet.create({
		listContainer: {
			maxWidth: '90%',
			backgroundColor: theme.colors.surface,
			borderRadius: 20,
			padding: 16,
			gap: 16
		},
		modal: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: undefined,
			position: 'absolute'
		}
	});
};

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
					users={this.props.incident.users}
					onDismiss={() => this.setState({ usersVisible: false })}
				/>
				<TouchableRipple style={incidentCardStyle().headerRipple} onPress={() => this.props.onClickIncident()} borderless={true}>
					<View style={incidentCardStyle().headerContainer}>
						<View style={incidentCardStyle().headerSection}>
							<View style={{ marginRight: 16 }}>
								<StatusIcon
									status={
										this.props.incident.resolved
											? 'resolved'
											: this.props.incident.users.length > 0
											? 'acknowledged'
											: 'error'
									}
								/>
							</View>
							<View style={{ flexShrink: 2 }}>
								<Text variant={'titleMedium'} adjustsFontSizeToFit={true} allowFontScaling={true} style={{ width: '100%' }}>
									{this.props.incident.companyPublic.name} #{this.props.incident.caseNumber}
								</Text>
								<Text style={{ color: PriorityColor(this.props.incident.priority) }} variant={'bodyMedium'}>
									Priority {this.props.incident.priority}
								</Text>
							</View>
						</View>
						<View style={{ ...incidentCardStyle().headerSection, flexShrink: 0 }}>
							<View>
								{this.props.incident.users?.length === 0 ? null : (
									<UserAvatar
										onPress={() => {
											this.setState({ usersVisible: true });
										}}
										cutName={true}
										extraUsers={this.props.incident.users.length - 1}
										name={this.props.incident.users[0].name}
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
	alarm: AlarmResponse;
	alternate: boolean;
	onClickAlarm: (id: string) => void;
}

class IncidentCardListItem extends Component<IncidentCardListItemProps> {
	render(): React.JSX.Element {
		return (
			<TouchableRipple onPress={() => this.props.onClickAlarm(this.props.alarm.id)} borderless={true}>
				<View style={this.props.alternate ? incidentCardStyle().listItemAlternate : incidentCardStyle().listItem}>
					<Text>{this.props.alarm.name}</Text>
				</View>
			</TouchableRipple>
		);
	}
}
interface IncidentCardListProps {
	alarms: AlarmResponse[];
	onClickAlarm: (id: string, alarm: AlarmResponse) => void;
}

export class IncidentCardList extends Component<IncidentCardListProps> {
	render(): React.JSX.Element {
		return (
			<View style={{ borderBottomRightRadius: 16, borderBottomLeftRadius: 16, overflow: 'hidden' }}>
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

interface IncidentCardProps {
	incident: IncidentData;
	onClickIncident: (id: string) => void;
	onClickAlarm: (id: string, alarm: AlarmResponse) => void;
}

interface IncidentCardState {
	collapsed: boolean;
}

class IncidentCard extends Component<IncidentCardProps, IncidentCardState> {
	state: IncidentCardState = {
		collapsed: true
	};

	shouldComponentUpdate(nextProps: Readonly<IncidentCardProps>, nextState: Readonly<IncidentCardState>, nextContext: any): boolean {
		if (nextState.collapsed !== this.state.collapsed) return true;
		return false;
	}

	render(): React.JSX.Element {
		return (
			<ContainerCard style={{ paddingBottom: 0 }}>
				<ContainerCard.Content>
					<IncidentCardHeader
						collapsed={this.state.collapsed}
						onClickButton={() => this.setState({ collapsed: !this.state.collapsed })}
						incident={this.props.incident}
						onClickIncident={() => this.props.onClickIncident(this.props.incident.id)}
					/>
					<View style={incidentCardStyle().list}>
						{this.state.collapsed ? null : (
							<IncidentCardList
								alarms={this.props.incident.alarms}
								onClickAlarm={(id: string, alarm: AlarmResponse) => this.props.onClickAlarm(id, alarm)}
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
		}
	});
};
export default IncidentCard;
