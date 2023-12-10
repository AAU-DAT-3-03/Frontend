import React, { Component } from 'react';
import { Appbar, IconButton, Menu, Searchbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import IncidentCard from '../../components/incidentCard/IncidentCard';
import SettingsMenu from './components/SettingsMenu';
import { FlatList, ListRenderItemInfo, ScrollView, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { AppRender } from '../../../App';
import LocalStorage from '../../utility/LocalStorage';
import DataHandler from '../../utility/DataHandler';
import { AlarmResponse, IncidentResponse, UserResponse } from '../../utility/DataHandlerTypes';
import Logger from '../../utility/Logger';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import LoadingScreen from '../../components/LoadingScreen';
import { compareIncident, filterIncidentList } from '../../utility/IncidentSort';
import LoadingIcon from '../../components/LoadingIcon';

enum Filter {
	NONE,
	CALLED,
	ASSIGNED
}

interface HomeState {
	hasIncidents: boolean;
	loading: boolean;
	filter: Filter;
	query: string;
	updating: boolean;
}

interface HomeAppBar {
	onFilterChange: (filter: Filter) => void;
	onQueryChange: (query: string) => void;
}

class HomeAppbar extends Component<HomeAppBar, any> {
	state = {
		query: '',
		filterVisible: false,
		filter: Filter.CALLED,
		menuVisible: false,
		icon: 'phone'
	};

	render(): React.JSX.Element {
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
						icon={this.state.icon}
						placeholder={'Search'}
						onChangeText={(query: string): void => {
							if (query === this.state.query) return;
							this.setState({ query: query });
							this.props.onQueryChange(query);
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
								if (this.state.filter === Filter.NONE) {
									this.setState({ filterVisible: false });
									return;
								}
								this.setState({ filter: Filter.NONE, filterVisible: false, icon: 'view-grid-outline' }, () =>
									this.props.onFilterChange(Filter.NONE)
								);
							}}
						/>
						<Menu.Item
							title={'My calls'}
							leadingIcon={'phone'}
							style={{
								backgroundColor: this.state.filter === Filter.CALLED ? getCurrentTheme().colors.primary : undefined,
								width: '100%'
							}}
							onPress={(): void => {
								if (this.state.filter === Filter.CALLED) {
									this.setState({ filterVisible: false });
									return;
								}
								this.setState({ filter: Filter.CALLED, filterVisible: false, icon: 'phone' }, () =>
									this.props.onFilterChange(Filter.CALLED)
								);
							}}
						/>
						<Menu.Item
							title={'Assigned incidents'}
							leadingIcon={'account-check'}
							style={{
								backgroundColor: this.state.filter === Filter.ASSIGNED ? getCurrentTheme().colors.primary : undefined,
								width: '100%'
							}}
							onPress={(): void => {
								if (this.state.filter === Filter.ASSIGNED) {
									this.setState({ filterVisible: false });
									return;
								}
								this.setState({ filter: Filter.ASSIGNED, filterVisible: false, icon: 'account-check' }, () =>
									this.props.onFilterChange(Filter.ASSIGNED)
								);
							}}
						/>
					</Menu>
				</View>

				<SettingsMenu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</Appbar.Header>
		);
	}
}

interface HomeRenderProps {
	navigation: NavigationProp<any>;
}

export class HomeRender extends Component<HomeRenderProps, HomeState> {
	private logger: Logger = new Logger('HomeScreen');
	private incidentData: IncidentResponse[] | undefined;

	state: HomeState = {
		hasIncidents: false,
		loading: true,
		filter: 0,
		query: '',
		updating: false
	};
	private loadingData: boolean = false;

	constructor(props: any) {
		super(props);
		AppRender.home = this;
		AppRender.navigation = this.props.navigation;
	}

	componentDidMount() {
		this.getIncidentResponse();
	}

	public refresh(): void {
		this.setState({ updating: true });
		this.getIncidentResponse();
	}

	private async getIncidentResponse(): Promise<void> {
		if (this.loadingData) return;
		this.loadingData = true;
		this.logger.info('Getting incident data');
		let incidentData: IncidentResponse[] = await DataHandler.getIncidentsData();
		this.logger.info('Sorting incident data');
		let incidentsSorted: IncidentResponse[] = this.sortIncidents(incidentData.filter((value: IncidentResponse) => !value.resolved));
		this.logger.info('Rendering incident data');
		this.incidentData = incidentsSorted;
		this.setState({ loading: false, hasIncidents: true, updating: false });
		this.loadingData = false;
	}

	/**
	 * This is messy, but it sorts everything in the proper order using QSort
	 * @param {IncidentResponse[]} incidents - List of incidents to sort
	 * @private
	 * @return {IncidentResponse[]} - The sorted list
	 */
	private sortIncidents(incidents: IncidentResponse[]): IncidentResponse[] {
		return incidents.sort(compareIncident);
	}

	private noIncidentsRender(): React.JSX.Element {
		return (
			<>
				{this.state.loading ? (
					<LoadingScreen />
				) : (
					<View style={HomeStyle().noIncidentContainer}>
						<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.elevation.level2 }}>
							No active incidents
						</Text>
					</View>
				)}
			</>
		);
	}

	private incidentsRender(filter: Filter): React.JSX.Element {
		let id: string = LocalStorage.getSettingsValue('id');
		let incidentData: IncidentResponse[] | undefined = this.filterIncidentList(this.incidentData, filter, id);

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
					renderItem={this.incidentCardRender.bind(this)}
					windowSize={2}
				/>
			</ScrollView>
		);
	}

	private incidentCardRender(info: ListRenderItemInfo<IncidentResponse>): React.JSX.Element {
		let navigation = this.props.navigation;
		let onClickIncident = (id: string) =>
			navigation.navigate('Incident', {
				id: id
			});
		let onClickAlarm = (id: string, alarm: AlarmResponse) =>
			navigation.navigate('Alarm', {
				id: id,
				alarm: alarm
			});
		return <IncidentCard incident={info.item} onClickIncident={onClickIncident.bind(this)} onClickAlarm={onClickAlarm.bind(this)} />;
	}

	private filterIncidentList(incidentData: IncidentResponse[] | undefined, filter: Filter, id: string): IncidentResponse[] | undefined {
		if (incidentData !== undefined) {
			incidentData = incidentData.filter((incident: IncidentResponse): boolean => {
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
			this.logger.info('Filtered list', incidentData?.length ?? -1, this.incidentData?.length);
		}

		return incidentData;
	}

	private onRefresh(finished: () => void): void {
		this.getIncidentResponse().then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<View>
				<LoadingIcon visible={this.state.updating} verticalOffset={60} />

				<ContentContainer
					appBar={
						<HomeAppbar
							onFilterChange={(filter: Filter) => this.setState({ filter: filter })}
							onQueryChange={(query: string) => this.setState({ query: query })}
						/>
					}
					onRefresh={(finished: () => void) => this.onRefresh(finished)}
				>
					{this.state.hasIncidents === false ? this.noIncidentsRender() : this.incidentsRender(this.state.filter)}
				</ContentContainer>
			</View>
		);
	}
}

const Home = () => {
	let navigation: NavigationProp<any> = useNavigation();
	return <HomeRender navigation={navigation} />;
};

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
