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
		period: { start: getToday(-30), end: getToday() },
		updating: false
	};

	constructor(props: any) {
		super(props);
		AppRender.history = this;
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Appbar.Header style={{ backgroundColor: getCurrentTheme().colors.surface }}>
					<SearchBarDateSelector
						onChange={(query: string, period: Period) => {
							if (
								!compareDatesEqual(this.state.period.start, period.start) ||
								!compareDatesEqual(this.state.period.end, period.end)
							) {
								this.setState({ updating: true }, () => {
									this.getIncidentResponse(period);
								});
							}
							this.setState({ period: period, query: query.toLowerCase() });
						}}
					/>
				</Appbar.Header>
			</>
		);
	}

	public refresh(): void {
		this.setState({ updating: true }, () => {
			this.getIncidentResponse(this.state.period);
		});
	}

	private async getIncidentResponse(period: Period): Promise<void> {
		let start: number = new Date(period.start[2], period.start[1] - 1, period.start[0]).getTime();
		let end: number = new Date(period.end[2], period.end[1] - 1, period.end[0]).getTime() + 86399999;
		this.logger.info(`Getting incident date for period: ${start}-${end} - ${new Date(start)}-${new Date(end)}`);
		let incidentData: IncidentResponse[] = await DataHandler.getResolvedIncidentsData(start, end);
		this.logger.info('Rendering Incidents');
		this.incidents = incidentData;
		this.setState({ loading: false, updating: false });
	}

	componentDidMount() {
		this.getIncidentResponse(this.state.period);
	}

	private filterIncidentList(incidentData: IncidentResponse[] | undefined): IncidentResponse[] | undefined {
		if (incidentData !== undefined) {
			incidentData = incidentData.filter((incident) => {
				return filterIncidentList(incident, this.state.query);
			});
		}

		return incidentData;
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

	private incidentsRender(): React.JSX.Element {
		let incidentData = this.filterIncidentList(this.incidents);
		return (
			<ScrollView
				horizontal={true}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
			>
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

	private onRefresh(finished: () => void): void {
		this.getIncidentResponse(this.state.period).then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<View>
				<LoadingIcon visible={this.state.updating} verticalOffset={60} />

				<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
					{this.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender()}
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
		}
	});
};

export default History;
