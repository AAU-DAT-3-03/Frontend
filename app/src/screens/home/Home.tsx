import React, { Component } from 'react';
import { Appbar, IconButton, Menu, Searchbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import IncidentCard from '../../components/incidentCard/IncidentCard';
import SettingsMenu from './components/SettingsMenu';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRender, ScreenProps } from '../../../App';
import LocalStorage from '../../utility/LocalStorage';
import DataHandler from '../../utility/DataHandler';
import { IncidentData, IncidentResponse, UserResponse } from '../../utility/DataHandlerTypes';
import Logger from '../../utility/Logger';

const Stack = createStackNavigator();

export const compareIncident = (a: IncidentResponse, b: IncidentResponse): number => {
	if (a.priority > b.priority) return 1;
	if (a.priority < b.priority) return -1;

	let aIncidentResolved: boolean = a.resolved;
	let aIncidentAcknowledged: boolean = a.users.length > 0;
	let aIncidentError: boolean = !aIncidentAcknowledged && !aIncidentResolved;

	let bIncidentResolved: boolean = b.resolved;
	let bIncidentAcknowledged: boolean = b.users.length > 0;
	let bIncidentError: boolean = !bIncidentAcknowledged && !bIncidentResolved;

	if (a.priority === b.priority) {
		if (aIncidentAcknowledged && bIncidentError) return 1;
		if (aIncidentError && bIncidentAcknowledged) return -1;
	}

	if (bIncidentResolved === aIncidentResolved && aIncidentAcknowledged === bIncidentAcknowledged) {
		if (a.companyPublic.id.toLowerCase() < b.companyPublic.id.toLowerCase()) return -1;
		if (a.companyPublic.id.toLowerCase() > b.companyPublic.id.toLowerCase()) return 1;
	}

	if (a.companyPublic.id === b.companyPublic.id) {
		if (a.caseNumber === undefined || b.caseNumber === undefined) return 0;
		if (a.caseNumber > b.caseNumber) return 1;
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
	incidents: IncidentData[] | undefined;
	loading: boolean;
	filterVisible: boolean;
	filter: Filter;
	query: string;
}

export function filterIncidentList(incident: IncidentData, query: string): boolean {
	if (query !== '') {
		let queries: [boolean, string][] = query
			.toLowerCase()
			.split(' ')
			.map((value) => [false, value]);
		for (let query of queries) {
			if (incident.companyPublic.name.toLowerCase().includes(query[1])) {
				query[0] = true;
				continue;
			}
			if (incident.caseNumber?.toString(10).includes(query[1])) {
				query[0] = true;
				continue;
			}

			if (
				incident.calls !== undefined &&
				incident.calls.filter((user: UserResponse) => {
					if (user === undefined) return false;
					return user.name.toLowerCase().includes(query[1]) || user.team?.toLowerCase().includes(query[1]);
				}).length > 0
			) {
				query[0] = true;
				continue;
			}

			if (
				incident.users !== undefined &&
				incident.users.filter((user: UserResponse) => {
					if (user === undefined) return false;
					return user.name.toLowerCase().includes(query[1]) || user.team?.toLowerCase().includes(query[1]);
				}).length > 0
			) {
				query[0] = true;
				continue;
			}

			if (incident.priority.toString(10).includes(query[1])) {
				query[0] = true;
			}
		}
		let queriesHit: number = queries.filter((value) => value[0] === true).length;
		if (queriesHit === queries.length) {
			return true;
		}
		return false;
	}
	return true;
}

class Home extends Component<any, HomeState> {
	private logger: Logger = new Logger('HomeScreen');

	state: HomeState = {
		menuVisible: false,
		incidents: undefined,
		loading: true,
		filterVisible: false,
		filter: 0,
		query: ''
	};
	private changed: boolean = false;
	private loadingData: boolean = false;

	constructor(props: any) {
		super(props);
		AppRender.home = this;
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar.Header style={{ backgroundColor: getCurrentTheme().colors.surface }}>
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
						style={{ flexShrink: 2, backgroundColor: getCurrentTheme().colors.surfaceVariant }}
						onIconPress={() => this.setState({ filterVisible: true })}
						mode={'bar'}
						icon={'filter'}
						traileringIcon={'magnify'}
						placeholder={'Search'}
						onChangeText={(query: string) => {
							this.changed = true;
							this.setState({ query: query });
						}}
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
							title={'All incidents'}
							leadingIcon={'view-grid-outline'}
							style={{
								backgroundColor: this.state.filter === Filter.NONE ? getCurrentTheme().colors.primary : undefined,
								width: '100%'
							}}
							onPress={() => {
								this.changed = true;
								this.setState({ filter: Filter.NONE, filterVisible: false });
							}}
						/>
						<Menu.Item
							title={'My calls'}
							leadingIcon={'phone'}
							style={{
								backgroundColor: this.state.filter === Filter.CALLED ? getCurrentTheme().colors.primary : undefined,
								width: '100%'
							}}
							onPress={() => {
								this.changed = true;
								this.setState({ filter: Filter.CALLED, filterVisible: false });
							}}
						/>
						<Menu.Item
							title={'Assigned incidents'}
							leadingIcon={'account-check'}
							style={{
								backgroundColor: this.state.filter === Filter.ASSIGNED ? getCurrentTheme().colors.primary : undefined,
								width: '100%'
							}}
							onPress={() => {
								this.changed = true;
								this.setState({ filter: Filter.ASSIGNED, filterVisible: false });
							}}
						/>
					</Menu>
				</View>

				<SettingsMenu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</Appbar.Header>
		);
	}

	componentDidMount() {
		this.getIncidentData();
	}

	public refresh(): void {
		this.getIncidentData();
	}

	private async getIncidentData() {
		if (this.loadingData) return;
		this.loadingData = true;
		this.logger.info('Getting incident data');
		let incidentData: IncidentData[] = await DataHandler.getIncidentsData();
		this.logger.info('Sorting incident data');
		let incidentsSorted: IncidentData[] = this.sortIncidents(incidentData.filter((value) => !value.resolved));
		this.logger.info('Rendering incident data');
		this.changed = true;
		this.setState({ incidents: undefined }, () => this.setState({ loading: false, incidents: incidentsSorted }));
		this.loadingData = false;
	}

	/**
	 * This is messy, but it sorts everything in the proper order using QSort
	 * @param {IncidentData[]} incidents - List of incidents to sort
	 * @private
	 * @return {IncidentData[]} - The sorted list
	 */
	private sortIncidents(incidents: IncidentData[]): IncidentData[] {
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
		let id: string = LocalStorage.getSettingsValue('id');
		let incidentData = this.state.incidents;
		if (this.changed) {
			incidentData = this.filterIncidentList(incidentData, filter, id);
		}

		return (
			<ScrollView
				horizontal={true}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
			>
				<FlatList
					data={incidentData}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={HomeStyle().incidentContainer}
					renderItem={(info) => (
						<IncidentCard
							incident={info.item}
							onClickIncident={(id) =>
								navigation.navigate('Incident', {
									id: id
								})
							}
							onClickAlarm={(id, alarm) =>
								navigation.navigate('Alarm', {
									id: id,
									alarm: alarm
								})
							}
						/>
					)}
				/>
			</ScrollView>
		);
	}

	private filterIncidentList(incidentData: IncidentData[] | undefined, filter: Filter, id: string): IncidentData[] | undefined {
		if (incidentData !== undefined) {
			incidentData = incidentData.filter((incident) => {
				let shouldShow: boolean = false;
				if (filter === Filter.NONE) {
					shouldShow = true;
				} else if (filter === Filter.CALLED) {
					shouldShow =
						incident.calls !== undefined && incident.calls?.filter((user: UserResponse): boolean => user.id === id).length > 0;
				} else if (filter === Filter.ASSIGNED) {
					shouldShow =
						incident.users !== undefined &&
						incident.users.filter((user: UserResponse): boolean => {
							return user.id === id;
						}).length > 0;
				}
				if (shouldShow) {
					return filterIncidentList(incident, this.state.query);
				}
				return false;
			});
			this.changed = false;
			this.logger.info('Filtered list', incidentData?.length ?? -1, this.state.incidents?.length);
		}

		return incidentData;
	}

	private homeRender(navigation: any): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={(finished: () => void) => this.onRefresh(finished)}>
				{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender(navigation, this.state.filter)}
			</ContentContainer>
		);
	}

	private onRefresh(finished: () => void): void {
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
