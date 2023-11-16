import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import IncidentCard, { IncidentType } from '../../components/incidentCard/IncidentCard';
import Menu from './components/Menu';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { IncidentGenerator } from './IncidentGenerator';
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { ScreenProps } from '../../../App';

let incidents: IncidentType[] = IncidentGenerator.generateIncidentList(2);

const Stack = createStackNavigator();

export const compareIncident = (a: IncidentType, b: IncidentType): number => {
	if (a.state === 'acknowledged' && b.state === 'error') return 1;
	if (a.state === 'error' && b.state === 'acknowledged') return -1;
	if (a.priority > b.priority) return 1;
	if (a.priority < b.priority) return -1;
	if (a.priority === b.priority) {
		if (a.company.toLowerCase() < b.company.toLowerCase()) return -1;
		if (a.company.toLowerCase() > b.company.toLowerCase()) return 1;
	}
	if (a.company === b.company) {
		if (a.caseNr > b.caseNr) return 1;
		return -1;
	}

	return 0;
};

interface HomeState {
	menuVisible: boolean;
	incidents: IncidentType[] | undefined;
	loading: boolean;
}

class Home extends Component<any, HomeState> {
	state: HomeState = {
		menuVisible: false,
		incidents: undefined,
		loading: true
	};

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Action icon={'menu'} onPress={() => this.setState({ menuVisible: true })} />
				<Menu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</Appbar>
		);
	}

	componentDidMount() {
		this.getIncidentDate();
	}

	/**
	 * @todo Get data from server instead
	 * @private
	 */
	private async getIncidentDate(): Promise<boolean> {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				incidents = this.sortIncidents(incidents.concat(IncidentGenerator.generateIncident()));
				this.setState({ loading: false, incidents: incidents });
				resolve(true);
			}, 3000);
		});
		return await promise;
	}

	/**
	 * This is messy, but it sorts everything in the proper order using QSort
	 * @param {IncidentType[]} incidents - List of incidents to sort
	 * @private
	 * @return {IncidentType[]} - The sorted list
	 */
	private sortIncidents(incidents: IncidentType[]): IncidentType[] {
		return incidents.sort(compareIncident);
	}

	private noIncidentsRender(): React.JSX.Element {
		return (
			<View style={HomeStyle().noIncidentContainer}>
				{this.state.loading ? (
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
				) : (
					<Text variant={'titleLarge'}>No active incidents</Text>
				)}
			</View>
		);
	}

	private incidentsRender(navigation: NavigationProp<any>): React.JSX.Element {
		return (
			<View style={HomeStyle().incidentContainer}>
				{this.state.incidents?.map((value, index) => {
					return (
						<IncidentCard
							key={index}
							incident={value}
							onClickIncident={(id) =>
								navigation.navigate('Incident', {
									alarm: `${id}`
								})
							}
							onClickAlarm={(id) =>
								navigation.navigate('Alarm', {
									alarm: `${id}`
								})
							}
						/>
					);
				})}
			</View>
		);
	}

	private homeRender(navigation: any): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={(finished: () => void) => this.onRefresh(finished)}>
				{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender(navigation)}
			</ContentContainer>
		);
	}

	private onRefresh(finished: () => void): void {
		this.getIncidentDate().then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'Home'}>
				<Stack.Screen options={{ headerShown: false }} name="HomeRender">
					{(props: ScreenProps) => this.homeRender(props.navigation)}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="Incident">
					{(props: ScreenProps) => <Incident {...props} />}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="Alarm">
					{(props: ScreenProps) => <Alarm {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
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
		},
		incidentContainer: {
			padding: 16,
			flexDirection: 'column',
			gap: 16
		}
	});
};

export default Home;
