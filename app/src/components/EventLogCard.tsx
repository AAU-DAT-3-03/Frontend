import React, { Component } from 'react';
import { Icon, IconButton, MD3Theme, Text, TouchableRipple } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { StyleSheet, View } from 'react-native';
import Color from 'color';
import ContainerCard from './ContainerCard';

type EventLog = {
	dateTime: number;
	user: string;
	message: string;
};

interface EventLogProps {
	eventLog: EventLog[];
}

interface EventLogContentProps {
	eventLog: EventLog;
}

class EventLogCardContent extends Component<EventLogContentProps> {
	state = {
		logVisible: false,
		expandable: false,
		indexSplice: 0
	};

	constructor(props: EventLogContentProps) {
		super(props);

		let firstNewline: number = this.props.eventLog.message.indexOf('\n');
		firstNewline = firstNewline < 1 ? 32 : firstNewline;
		this.state.indexSplice = Math.min(firstNewline, 32, this.props.eventLog.message.length);
		this.state.expandable = this.state.indexSplice < this.props.eventLog.message.length;
	}

	private formatNumber(number: number): string {
		let time: string = `${number}`;
		if (number < 10) {
			time = `0${number}`;
		}
		return time;
	}

	private header(): React.JSX.Element {
		let date: Date = new Date(this.props.eventLog.dateTime);
		let formattedDate: string = `${this.formatNumber(date.getDate())}/${this.formatNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
		let formattedTime: string = `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}`;
		return (
			<View style={eventLogStyleSheet().logHeader}>
				<View style={eventLogStyleSheet().avatarContainer}>
					<Icon size={18} source={'account'} color={'white'} />
					<Text style={eventLogStyleSheet().avatarText}>{this.props.eventLog.user}</Text>
				</View>
				<Text variant={'titleSmall'}>
					{formattedDate} - {formattedTime}
				</Text>
			</View>
		);
	}

	render(): React.JSX.Element {
		let theme: MD3Theme = getCurrentTheme();
		return (
			<View style={eventLogStyleSheet().logContainer}>
				{this.header()}

				{this.state.expandable ? (
					<TouchableRipple
						rippleColor={Color(theme.colors.onSurface).alpha(0.3).string()}
						onPress={() => this.setState({ logVisible: !this.state.logVisible })}
						borderless={true}
						style={eventLogStyleSheet().logMessageContainer}
					>
						<View>
							<IconButton
								style={eventLogStyleSheet().avatarIcon}
								icon={this.state.logVisible ? 'menu-up' : 'menu-down'}
								iconColor={eventLogStyleSheet().logMessage.color}
							/>
							<Text variant={'bodyLarge'} style={eventLogStyleSheet().logMessage}>
								{this.state.logVisible
									? this.props.eventLog.message
									: this.props.eventLog.message.slice(0, this.state.indexSplice) + (this.state.expandable ? '...' : '')}
							</Text>
						</View>
					</TouchableRipple>
				) : (
					<View style={eventLogStyleSheet().logMessageContainer}>
						<Text variant={'bodyLarge'} style={eventLogStyleSheet().logMessage}>
							{this.props.eventLog.message}
						</Text>
					</View>
				)}
			</View>
		);
	}
}

class EventLogCard extends Component<EventLogProps> {
	render(): React.JSX.Element {
		return (
			<ContainerCard>
				<ContainerCard.Header>
					<Text variant={'titleMedium'} style={eventLogStyleSheet().title}>
						Event Log
					</Text>
				</ContainerCard.Header>
				<ContainerCard.Content style={eventLogStyleSheet().card}>
					{this.props.eventLog.length < 1 ? (
						<View style={eventLogStyleSheet().eventLogText}>
							<Text>No changes has been made</Text>
						</View>
					) : null}
					{this.props.eventLog
						.sort((a, b) => {
							if (a.dateTime < b.dateTime) return 1;
							return -1;
						})
						.map((log: EventLog, key: number) => {
							return <EventLogCardContent key={key} eventLog={log} />;
						})}
				</ContainerCard.Content>
			</ContainerCard>
		);
	}
}

const mainColor: string = getCurrentTheme().colors.onSurface;
const eventLogStyleSheet = () => {
	return StyleSheet.create({
		eventLogText: { width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
		avatarIcon: {
			position: 'absolute',
			right: 0,
			top: -4
		},
		avatarContainer: {
			flexDirection: 'row',
			gap: 3,
			paddingLeft: 4,
			paddingRight: 8,
			paddingVertical: 4,
			borderRadius: 16,
			margin: 0,
			backgroundColor: getCurrentTheme().colors.primary
		},
		avatarText: {
			height: '100%',
			verticalAlign: 'top',
			color: 'white'
		},
		card: {
			padding: 0
		},
		logMessage: {
			color: getCurrentTheme().colors.onSurface,
			padding: 8
		},
		logMessageContainer: {
			padding: 0,
			margin: 0,
			marginTop: 4,
			marginHorizontal: 4,
			borderRadius: 16,
			backgroundColor: getCurrentTheme().colors.elevation.level3
		},
		logContainer: {
			backgroundColor: getCurrentTheme().colors.elevation.level2,
			borderRadius: 16,
			paddingHorizontal: 4,
			paddingVertical: 8,
			marginTop: 10,
			flexDirection: 'column',
			justifyContent: 'flex-start'
		},
		title: {
			width: '100%',
			textAlign: 'center',
			paddingBottom: 8,
			borderBottomWidth: 0.3,
			borderBottomColor: mainColor
		},
		logHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 2,
			borderRadius: 16,
			paddingHorizontal: 8,
			verticalAlign: 'middle'
		}
	});
};

export default EventLogCard;
