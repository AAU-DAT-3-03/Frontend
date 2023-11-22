import React, { Component } from 'react';
import { IconButton, Menu, Searchbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import IncidentCard, { IncidentType } from '../../components/incidentCard/IncidentCard';
import SettingsMenu from './components/SettingsMenu';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';
import { createStackNavigator } from '@react-navigation/stack';
import { ScreenProps } from '../../../App';
import LocalStorage from '../../utility/LocalStorage';
import { MockDataGenerator, users } from '../../utility/MockDataGenerator';

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

enum Filter {
	NONE,
	CALLED,
	ASSIGNED
}

interface HomeState {
	menuVisible: boolean;
	incidents: IncidentType[] | undefined;
	loading: boolean;
	filterVisible: boolean;
	filter: Filter;
	query: string;
}

class Home extends Component<any, HomeState> {
	state: HomeState = {
		menuVisible: false,
		incidents: undefined,
		loading: true,
		filterVisible: false,
		filter: 0,
		query: ''
	};

	private AppBar(): React.JSX.Element {
		return (
			<>
				<View
					style={{
						width: '100%',
						paddingHorizontal: 0,
						margin: 0,
						justifyContent: 'flex-end',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Searchbar
						style={{ flexShrink: 2 }}
						onIconPress={() => this.setState({ filterVisible: true })}
						icon={'menu'}
						traileringIcon={'magnify'}
						placeholder={'Search'}
						onChangeText={(query: string) => this.setState({ query: query })}
						value={this.state.query}
						onClearIconPress={() => this.setState({ query: '' })}
					/>
					<IconButton icon={'cog'} onPress={() => this.setState({ menuVisible: true })} />
					<Menu
						anchor={{ x: 0, y: 64 }}
						visible={this.state.filterVisible}
						onDismiss={() => this.setState({ filterVisible: false })}
					>
						<Menu.Item
							title={'None'}
							style={{ backgroundColor: this.state.filter === Filter.NONE ? getCurrentTheme().colors.primary : undefined }}
							onPress={() => this.setState({ filter: Filter.NONE, filterVisible: false })}
						/>
						<Menu.Item
							title={'Called'}
							style={{ backgroundColor: this.state.filter === Filter.CALLED ? getCurrentTheme().colors.primary : undefined }}
							onPress={() => this.setState({ filter: Filter.CALLED, filterVisible: false })}
						/>
						<Menu.Item
							title={'Assigned'}
							style={{
								backgroundColor: this.state.filter === Filter.ASSIGNED ? getCurrentTheme().colors.primary : undefined
							}}
							onPress={() => this.setState({ filter: Filter.ASSIGNED, filterVisible: false })}
						/>
					</Menu>
				</View>

				<SettingsMenu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</>
		);
	}

	componentDidMount() {
		this.getIncidentData();
	}

	/**
	 * @todo Get data from server instead
	 * @private
	 */
	private async getIncidentData(): Promise<boolean> {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				let incidentsSorted = this.sortIncidents(MockDataGenerator.getAllIncidents().filter((value) => value.state !== 'resolved'));
				this.setState({ loading: false, incidents: incidentsSorted });
				resolve(true);
			}, 1);
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
					<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.elevation.level2 }}>
						No active incidents
					</Text>
				)}
			</View>
		);
	}

	private incidentsRender(navigation: any, filter: Filter): React.JSX.Element {
		let phoneNr: number = parseInt(LocalStorage.getSettingsValue('phone'), 10);
		return (
			<View style={HomeStyle().incidentContainer}>
				{this.state.incidents
					?.filter((incident) => {
						if (filter === Filter.NONE) return true;
						if (filter === Filter.CALLED) {
							return (
								incident.calledUsers !== undefined &&
								incident.calledUsers?.filter((value) => value.phoneNr === phoneNr).length > 0
							);
						}
						return (
							incident.assignedUsers !== undefined &&
							incident.assignedUsers.filter((user) => user.phoneNr === phoneNr).length > 0
						);
					})
					.filter((incident) => {
						if (this.state.query !== '') {
							let query: string = this.state.query.toLowerCase();
							if (incident.company.toLowerCase().includes(query)) return true;
							if (incident.caseNr.toString(10).includes(query)) return true;
							if (
								incident.calledUsers !== undefined &&
								incident.calledUsers.filter(
									(user) => user.name.toLowerCase().includes(query) || user.team.toLowerCase().includes(query)
								).length > 0
							)
								return true;
							if (
								incident.assignedUsers !== undefined &&
								incident.assignedUsers.filter(
									(user) => user.name.toLowerCase().includes(query) || user.team.toLowerCase().includes(query)
								).length > 0
							)
								return true;
							if (incident.priority.toString(10).includes(query)) return true;
							return false;
						}
						return true;
					})
					.map((value, index) => {
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
										id: id
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
				{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender(navigation, this.state.filter)}
			</ContentContainer>
		);
	}

	private onRefresh(finished: () => void): void {
		MockDataGenerator.generateIncident();
		this.getIncidentData().then(() => finished());
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
