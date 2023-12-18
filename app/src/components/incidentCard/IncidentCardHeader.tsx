import { IncidentResponse } from '../../utility/DataHandlerTypes';
import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import StatusIcon, { IncidentState } from '../StatusIcon';
import UserAvatar from './UserAvatar';
import { PriorityColor } from './IncidentCard';
import UserList from './UserList';

interface IncidentCardHeaderProps {
	collapsed: boolean;
	onClickButton?: () => void;
	onClickIncident: () => void;
	incident: IncidentResponse;
}

interface IncidentCardHeaderState {
	usersVisible: boolean;
}

class IncidentCardHeader extends Component<IncidentCardHeaderProps, IncidentCardHeaderState> {
	state: IncidentCardHeaderState = {
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

		let statusIcon: IncidentState = 'error';
		if (this.props.incident.resolved) statusIcon = 'resolved';
		else if (this.props.incident.users.length > 0) statusIcon = 'acknowledged';

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
							<View style={incidentCardStyle().statusIconWrapper}>
								<StatusIcon status={statusIcon} />
							</View>
							<View style={incidentCardStyle().shrink}>
								<Text
									variant={'titleMedium'}
									adjustsFontSizeToFit={true}
									allowFontScaling={true}
									style={incidentCardStyle().fullWidth}
								>
									{this.props.incident.companyPublic.name} #{this.props.incident.caseNumber}
								</Text>
								<Text style={{ color: PriorityColor(this.props.incident.priority) }} variant={'bodyMedium'}>
									Priority {this.props.incident.priority}
								</Text>
							</View>
						</View>
						<View style={incidentCardStyle().userWrapper}>
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
		statusIconWrapper: {
			marginRight: 16
		},
		fullWidth: {
			width: '100%'
		},
		shrink: {
			flexShrink: 2
		},
		userWrapper: {
			overflow: 'hidden',
			paddingLeft: 4,
			flexDirection: 'row',
			alignItems: 'center',
			flexShrink: 0
		}
	});
};

export default IncidentCardHeader;
