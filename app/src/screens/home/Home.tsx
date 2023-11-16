import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { Incident } from '../../components/incidentCard/IncidentCard';
import Menu from './components/Menu';
import { StyleSheet, View } from 'react-native';

const incident: Incident = {
	state: 'acknowledged',
	alarms: [
		{ alarmError: 'Crashed 4 times', id: 1 },
		{ alarmError: 'OOM Killed', id: 2 },
		{ alarmError: 'Restarted', id: 3 }
	],
	caseNr: 1027,
	company: 'Jysk',
	users: [
		{ name: 'Bent', phoneNr: 12345678 },
		{ name: 'Ole', phoneNr: 12345678 },
		{ name: 'Rasmus', phoneNr: 12345678 }
	],
	priority: 2
};

interface HomeState {
	menuVisible: boolean;
	incidents: Incident[] | undefined;
}

class Home extends Component<any, HomeState> {
	state: HomeState = {
		menuVisible: false,
		incidents: undefined
	};

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Action icon={'menu'} onPress={() => this.setState({ menuVisible: true })} />
				<Menu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</Appbar>
		);
	}

	private noIncidentsRender(): React.JSX.Element {
		return (
			<View style={HomeStyle().noIncidentContainer}>
				<Text variant={'titleLarge'}>No active incidents</Text>
			</View>
		);
	}

	private incidentsRender(): React.JSX.Element {
		return (
			<View>
				<Text>No active incidents</Text>
			</View>
		);
	}

	private onRefresh(finished: () => void): void {
		setTimeout(() => finished(), 5000);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={this.onRefresh}>
				{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender()}
			</ContentContainer>
		);
	}
}

const HomeStyle = () => {
	return StyleSheet.create({
		noIncidentContainer: {
			height: '100%',
			width: '100%',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		}
	});
};

export default Home;
