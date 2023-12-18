import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { AppRender } from '../../../App';
import SearchBarDateSelector, { Period } from '../../components/SearchBarDateSelector';
import IncidentCard from '../../components/incidentCard/IncidentCard';
import { FlatList, ListRenderItemInfo, ScrollView, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { compareDatesEqual, getToday } from '../../components/TimePicker/DateHelper';
import DataHandler from '../../utility/DataHandler';
import { AlarmResponse, IncidentResponse } from '../../utility/DataHandlerTypes';
import Logger from '../../utility/Logger';
import LoadingIcon from '../../components/LoadingIcon';
import LoadingScreen from '../../components/LoadingScreen';
import { filterIncidentList } from '../../utility/IncidentSort';

interface HistoryState {
	loading: boolean;
	query: string;
	period: Period;
	updating: boolean;
}

class History extends Component<any, HistoryState> {
	private logger: Logger = new Logger('HistoryScreen');
	private incidents: IncidentResponse[] | undefined;

	state: HistoryState = {
		loading: true,
		query: '',
		// Period defaults to the last 30 days from current day
		period: {
			start: getToday(-30),
			end: getToday()
		},
		updating: false
	};

	constructor(props: any) {
		super(props);
		// Adds the render to the main app render for updating from other components
		AppRender.history = this;
	}

	/**
	 * Creates the app bar render
	 * @returns {React.JSX.Element} - Returns the app bar render with a date selector searchbar
	 */
	private AppBar(): React.JSX.Element {
		return (
			<Appbar.Header style={HistoryStyle().appBarHeader}>
				<SearchBarDateSelector onChange={(query: string, period: Period) => this.onChange(query, period)} />
			</Appbar.Header>
		);
	}

	/**
	 * Handles the onChange of the searchbar from the appBar
	 * @param {string} query - Search query
	 * @param {Period} period - Start and end date
	 */
	private onChange(query: string, period: Period): void {
		// If either of the dates has changed get new data from server
		let startDataChanged: boolean = !compareDatesEqual(this.state.period.start, period.start);
		let endDataChanged: boolean = !compareDatesEqual(this.state.period.end, period.end);
		if (startDataChanged || endDataChanged) {
			this.setState({ updating: true }, (): void => {
				this.getIncidentResponse(period);
			});
		}

		this.setState({ period: period, query: query.toLowerCase() });
	}

	/**
	 * Refreshes data on the history screen, called from other components
	 */
	public refresh(): void {
		this.setState({ updating: true }, () => {
			this.getIncidentResponse(this.state.period);
		});
	}

	/**
	 * Gets all resolved incidents within a period
	 * @param {Period} period - The period to get data from
	 */
	private async getIncidentResponse(period: Period): Promise<void> {
		// Convert period to iso-8601 standard (Milliseconds since 1/1/1970)
		let start: number = new Date(period.start[2], period.start[1] - 1, period.start[0]).getTime();
		// 86399999 sets the time to a millisecond before midnight
		let end: number = new Date(period.end[2], period.end[1] - 1, period.end[0]).getTime() + 86399999;

		// Get the data from the specified period
		this.logger.info(`Getting incident date for period: ${start}-${end} - ${new Date(start)}-${new Date(end)}`);
		let incidentData: IncidentResponse[] = await DataHandler.getResolvedIncidentsData(start, end);

		this.logger.info('Rendering Incidents');
		// Update the state and data of the history screen
		this.incidents = incidentData;
		this.setState({ loading: false, updating: false });
	}

	/**
	 * Get resolved data from the server when the component gets mounted
	 */
	componentDidMount() {
		this.getIncidentResponse(this.state.period);
	}

	/**
	 * Filters the incidents based on the query from the searchbar
	 * @param {IncidentResponse} incidentData
	 */
	private filterIncidentList(incidentData: IncidentResponse[] | undefined): IncidentResponse[] | undefined {
		if (incidentData !== undefined) {
			incidentData = incidentData.filter((incident: IncidentResponse) => {
				return filterIncidentList(incident, this.state.query);
			});
		}

		return incidentData;
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
	 * Creates the render for the list of incidents
	 * @returns {React.JSX.Element} - The incident list render
	 */
	private incidentListRender(): React.JSX.Element {
		// Filter the list of incidents
		let incidentData: IncidentResponse[] | undefined = this.filterIncidentList(this.incidents);
		return (
			<ScrollView horizontal={true} showsVerticalScrollIndicator={false} contentContainerStyle={HistoryStyle().incidentList}>
				{/* Flat list is virtualized render, which renders items in batches to minimize lag */}
				<FlatList
					data={incidentData}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={HistoryStyle().incidentContainer}
					renderItem={this.incidentCardRender.bind(this)}
					windowSize={2}
				/>
			</ScrollView>
		);
	}

	/**
	 * Creates the render for loading initial data or no incidents screen if none is available
	 * @returns {React.JSX.Element} - Either the loading screen render or no active screen render
	 */
	private noIncidentsRender(): React.JSX.Element {
		return (
			<>
				{this.state.loading ? (
					<LoadingScreen />
				) : (
					<View style={HistoryStyle().noIncidentContainer}>
						<Text variant={'titleLarge'}>No active incidents</Text>
					</View>
				)}
			</>
		);
	}

	/**
	 * Handles the refresh of the screen, when user pulls down
	 * @param {() => void} finished - Function to call when refresh is finished
	 */
	private onRefresh(finished: () => void): void {
		this.getIncidentResponse(this.state.period).then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<View>
				<LoadingIcon visible={this.state.updating} verticalOffset={60} />

				<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
					{this.incidents === undefined ? this.noIncidentsRender() : this.incidentListRender()}
				</ContentContainer>
			</View>
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
		},
		appBarHeader: {
			backgroundColor: getCurrentTheme().colors.surface
		},
		incidentList: {
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0
		}
	});
};

export default History;
