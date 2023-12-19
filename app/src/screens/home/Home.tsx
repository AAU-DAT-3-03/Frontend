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
import LoadingScreen from '../../components/LoadingScreen';
import { compareIncident, filterIncidentList } from '../../utility/IncidentSort';
import LoadingIcon from '../../components/LoadingIcon';

enum Filter {
	NONE,
	CALLED,
	ASSIGNED
}

interface HomeAppBar {
	onFilterChange: (filter: Filter) => void;
	onQueryChange: (query: string) => void;
}

interface HomeAppBarState {
	query: string;
	filterVisible: boolean;
	filter: Filter;
	menuVisible: boolean;
	icon: string;
}

class HomeAppbar extends Component<HomeAppBar, HomeAppBarState> {
	state: HomeAppBarState = {
		query: '',
		filterVisible: false,
		filter: Filter.CALLED,
		menuVisible: false,
		icon: 'phone'
	};

	/**
	 * Creates the dropdown menu render for selecting predefined filters
	 * @returns {React.JSX.Element} - The filter menu render
	 */
	private menuRender(): React.JSX.Element {
		return (
			<Menu anchor={{ x: 0, y: 64 }} visible={this.state.filterVisible} onDismiss={() => this.setState({ filterVisible: false })}>
				{this.menuItemRender(Filter.NONE, 'view-grid-outline', 'All incidents')}
				{this.menuItemRender(Filter.CALLED, 'phone', 'My calls')}
				{this.menuItemRender(Filter.ASSIGNED, 'account-check', 'Assigned incidents')}
			</Menu>
		);
	}

	/**
	 * Handles onChange when selecting a menu filter
	 * @param {Filter} filter - The filter to was selected
	 * @param {string} icon - The icon for the filter
	 */
	private onChange(filter: Filter, icon: string): void {
		if (this.state.filter === filter) {
			this.setState({ filterVisible: false });
			return;
		}
		this.setState({ filter: filter, filterVisible: false, icon: icon }, () => this.props.onFilterChange(filter));
	}

	/**
	 * Creates the render for a menu item filter
	 * @param {Filter} filter - The filter this menu item corresponds to
	 * @param {string} icon - The icon to display
	 * @param {string} title - The title to display
	 * @returns {React.JSX.Element} - Returns a menu item for a filter
	 */
	private menuItemRender(filter: Filter, icon: string, title: string): React.JSX.Element {
		return (
			<Menu.Item
				title={title}
				leadingIcon={icon}
				style={this.state.filter === filter ? HomeStyle().menuItemSelected : HomeStyle().menuItem}
				onPress={(): void => {
					this.onChange(filter, icon);
				}}
			/>
		);
	}

	render(): React.JSX.Element {
		return (
			<Appbar.Header style={{ backgroundColor: getCurrentTheme().colors.surface }}>
				<View style={HomeStyle().appBarHeader}>
					<Searchbar
						style={HomeStyle().searchbar}
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
					{this.menuRender()}
				</View>

				<SettingsMenu visible={this.state.menuVisible} onDismiss={() => this.setState({ menuVisible: false })} />
			</Appbar.Header>
		);
	}
}

interface HomeState {
	hasIncidents: boolean;
	loading: boolean;
	filter: Filter;
	query: string;
	updating: boolean;
}

export class Home extends Component<any, HomeState> {
	private logger: Logger = new Logger('HomeScreen');
	private incidentData: IncidentResponse[] | undefined;

	state: HomeState = {
		hasIncidents: false,
		loading: true,
		filter: Filter.CALLED,
		query: '',
		updating: false
	};

	// Whether data is currently being retrieved from the server
	private loadingData: boolean = false;

	constructor(props: any) {
		super(props);
		AppRender.home = this;
		AppRender.navigation = this.props.navigation;
	}

	/**
	 * Get actibe data from the server when the component gets mounted
	 */
	componentDidMount() {
		this.getIncidentResponse();
	}

	/**
	 * Refreshes data on the home screen, called from other components
	 */
	public refresh(): void {
		this.setState({ updating: true });
		this.getIncidentResponse();
	}

	/**
	 * Gets all active incidents
	 */
	private async getIncidentResponse(): Promise<void> {
		// Don't retrieve data if it's already happening
		if (this.loadingData) return;

		this.loadingData = true;
		this.logger.info('Getting incident data');
		// Get incident data
		let incidentData: IncidentResponse[] = await DataHandler.getIncidentsData();

		this.logger.info('Sorting incident data');
		// Sort the incident data, so they are order correctly when rendering happens
		let incidentsSorted: IncidentResponse[] = this.sortIncidents(incidentData.filter((value: IncidentResponse) => !value.resolved));

		this.logger.info('Rendering incident data');

		// Update the incident data and state of the screen
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

	/**
	 * Creates either the loading screen if component is freshly mounted or the no active incidents if no active incidents are available
	 * @returns {React.JSX.Element} - Either the loading render or no active incidents render
	 */
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

	/**
	 * Creates the list of incidents render. It gets filtered first based on currently active filters
	 * @param filter
	 * @returns {React.JSX.Element} - The list of incidents render
	 */
	private incidentListRender(filter: Filter): React.JSX.Element {
		let id: string = LocalStorage.getSettingsValue('id');
		// Filter list based on currently active filters
		let incidentData: IncidentResponse[] | undefined = this.filterIncidentList(this.incidentData, filter, id);

		return (
			<ScrollView horizontal={true} showsVerticalScrollIndicator={false} contentContainerStyle={HomeStyle().incidentList}>
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

	/**
	 * Creates the Incident Card render
	 * @param {ListRenderItemInfo<IncidentResponse>} info - The incident to create an incident card render for
	 * @returns {React.JSX.Element} - Incident Card render
	 */
	private incidentCardRender(info: ListRenderItemInfo<IncidentResponse>): React.JSX.Element {
		let navigation = this.props.navigation;

		// Handles navigation when clicking on the incident
		let onClickIncident = (id: string) =>
			navigation.navigate('Incident', {
				id: id
			});

		// Handles navigation when clicking on an alarm
		let onClickAlarm = (id: string, alarm: AlarmResponse) =>
			navigation.navigate('Alarm', {
				id: id,
				alarm: alarm
			});
		return <IncidentCard incident={info.item} onClickIncident={onClickIncident.bind(this)} onClickAlarm={onClickAlarm.bind(this)} />;
	}

	/**
	 * Filters the current incident list based on the filter selected in the app bar menu if incident data is available
	 * @param {IncidentResponse[] | undefined} incidentData - List of incident data
	 * @param {Filter} filter - Currently selected filter from the menu
	 * @param {string } id - The id of the user
	 * @returns {IncidentResponse[] | undefined} - Either the filtered list or undefined if no incident data is available
	 */
	private filterIncidentList(incidentData: IncidentResponse[] | undefined, filter: Filter, id: string): IncidentResponse[] | undefined {
		if (incidentData !== undefined) {
			incidentData = incidentData.filter((incident: IncidentResponse): boolean => {
				let shouldShow: boolean = false;

				// Filter the current incident based on the selected filter in the app bar menu
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

				// If the current incident hasn't been filtered, filter it based on the query
				if (shouldShow) {
					return filterIncidentList(incident, this.state.query);
				}
				return false;
			});
			this.logger.info('Filtered list', incidentData?.length ?? -1, this.incidentData?.length);
		}

		return incidentData;
	}

	/**
	 * Handles the refresh of the screen, when user pulls down
	 * @param {() => void} finished - Function to call when refresh is finished
	 */
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
					{!this.state.hasIncidents ? this.noIncidentsRender() : this.incidentListRender(this.state.filter)}
				</ContentContainer>
			</View>
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
		},
		menuItemSelected: {
			backgroundColor: getCurrentTheme().colors.primary,
			width: '100%'
		},
		menuItem: {
			width: '100%'
		},
		appBarHeader: {
			width: '100%',
			paddingHorizontal: 0,
			margin: 0,
			justifyContent: 'flex-end',
			flexDirection: 'row',
			alignItems: 'center'
		},
		searchbar: {
			flexShrink: 2,
			backgroundColor: getCurrentTheme().colors.surfaceVariant
		},
		incidentList: {
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0
		}
	});
};

export default Home;
