import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { ScreenProps } from '../../../App';
import SearchBarDateSelector, { Period } from '../../components/SearchBarDateSelector';
import IncidentCard, { IncidentType } from '../../components/incidentCard/IncidentCard';
import { IncidentGenerator, incidents, setIncidents } from '../home/IncidentGenerator';
import { compareIncident } from '../home/Home';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { compareDatesEqual, getToday } from '../../components/TimePicker/DateHelper';

const Stack = createStackNavigator();

interface HistoryState {
	incidents: IncidentType[] | undefined;
	filteredIncidents: IncidentType[] | undefined;
	loading: boolean;
	query: string;
	period: Period;
}

class History extends Component<any, HistoryState> {
	state: HistoryState = {
		incidents: undefined,
		filteredIncidents: undefined,
		loading: true,
		query: '',
		period: { start: getToday(-30), end: getToday() }
	};

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Header>
					<SearchBarDateSelector
						onChange={(query: string, period: Period) => {
							if (this.state.query !== query.toLowerCase()) {
								this.filterIncident(query);
							}
							if (
								!compareDatesEqual(this.state.period.start, period.start) ||
								!compareDatesEqual(this.state.period.end, period.end)
							) {
								this.getIncidentData(period);
							}
							this.setState({ period: period, query: query.toLowerCase() });
						}}
					/>
				</Appbar.Header>
			</Appbar>
		);
	}

	private filterIncident(query: string) {
		if (this.state.incidents === undefined) return;
		query = query.toLowerCase();
		let incidents: IncidentType[] = this.state.incidents?.filter((value) => {
			if (value.company.toLowerCase().includes(query)) return true;
			if (
				value.users !== undefined &&
				value.users.filter((value) => {
					return value.name.toLowerCase().includes(query);
				}).length > 0
			)
				return true;
			if (value.caseNr.toString().includes(query)) return true;
			if (value.priority.toString().includes(query)) return true;
			return false;
		});
		this.setState({ filteredIncidents: incidents });
	}

	/**
	 * This is messy, but it sorts everything in the proper order using QSort
	 * @param {IncidentType[]} incidents - List of incidents to sort
	 * @private
	 * @return {IncidentType[]} - The sorted list
	 */
	private sortIncidents(incidents: IncidentType[]): IncidentType[] {
		return incidents.sort((a: IncidentType, b: IncidentType) => {
			if (a.date?.getTime() > b.date?.getTime()) return 1;
			if (a.date?.getTime() < b.date?.getTime()) return -1;
			return compareIncident(a, b);
		});
	}

	/**
	 * @todo Get data from server instead with a period
	 * @private
	 */
	private async getIncidentData(period: Period): Promise<boolean> {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				let filteredIncidents = this.sortIncidents(
					setIncidents(incidents.concat(IncidentGenerator.generateIncident(true))).filter((value) => value.state === 'resolved')
				);
				this.setState({ loading: false, incidents: filteredIncidents, filteredIncidents: filteredIncidents });
				resolve(true);
			}, 3000);
		});
		return await promise;
	}

	componentDidMount() {
		this.getIncidentData(this.state.period);
	}

	private incidentsRender(navigation: NavigationProp<any>): React.JSX.Element {
		return (
			<View style={HistoryStyle().incidentContainer}>
				{this.state.filteredIncidents?.map((value, index) => {
					return (
						<IncidentCard
							key={index}
							incident={value}
							onClickIncident={(id) =>
								navigation.navigate('Incident', {
									id: id
								})
							}
							onClickAlarm={(id) =>
								navigation.navigate('Alarm', {
									alarm: id
								})
							}
						/>
					);
				})}
			</View>
		);
	}

	private noIncidentsRender(): React.JSX.Element {
		return (
			<View style={HistoryStyle().noIncidentContainer}>
				{this.state.loading ? (
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
				) : (
					<Text variant={'titleLarge'}>No active incidents</Text>
				)}
			</View>
		);
	}

	private HistoryRender(navigation: NavigationProp<any>): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
				{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender(navigation)}
			</ContentContainer>
		);
	}

	private onRefresh(finished: () => void): void {
		this.getIncidentData(this.state.period).then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'Home'}>
				<Stack.Screen options={{ headerShown: false }} name="HomeRender">
					{(props: ScreenProps) => this.HistoryRender(props.navigation)}
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

const HistoryStyle = () => {
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

export default History;
