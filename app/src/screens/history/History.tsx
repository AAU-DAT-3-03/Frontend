import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { NavigationProp } from '@react-navigation/native';
import { AppRender } from '../../../App';
import SearchBarDateSelector, { Period } from '../../components/SearchBarDateSelector';
import IncidentCard from '../../components/incidentCard/IncidentCard';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { compareDatesEqual, getToday } from '../../components/TimePicker/DateHelper';
import DataHandler from '../../utility/DataHandler';
import { IncidentData } from '../../utility/DataHandlerTypes';
import Logger from '../../utility/Logger';
import LoadingIcon from '../../components/LoadingIcon';
import LoadingScreen from '../../components/LoadingScreen';
import { filterIncidentList } from '../../utility/IncidentSort';

interface HistoryState {
	incidents: IncidentData[] | undefined;
	loading: boolean;
	query: string;
	period: Period;
	updating: boolean;
}

class History extends Component<any, HistoryState> {
	private logger: Logger = new Logger('HistoryScreen');
	state: HistoryState = {
		incidents: undefined,
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
								console.log('test');
								this.setState({ updating: true }, () => {
									this.getIncidentData(period);
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
			this.getIncidentData(this.state.period);
		});
	}

	private async getIncidentData(period: Period): Promise<void> {
		let start: number = new Date(period.start[2], period.start[1] - 1, period.start[0]).getTime();
		let end: number = new Date(period.end[2], period.end[1] - 1, period.end[0]).getTime() + 86399999;
		this.logger.info(`Getting incident date for period: ${start}-${end} - ${new Date(start)}-${new Date(end)}`);
		let incidentData: IncidentData[] = await DataHandler.getResolvedIncidentsData(start, end);
		this.logger.info('Rendering Incidents');
		this.setState({ incidents: incidentData, loading: false, updating: false });
	}

	componentDidMount() {
		this.getIncidentData(this.state.period);
	}

	private incidentsRender(navigation: NavigationProp<any>): React.JSX.Element {
		return (
			<View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
				<View style={HistoryStyle().incidentContainer}>
					{this.state.incidents
						?.filter((incident) => filterIncidentList(incident, this.state.query))
						?.map((value, index) => {
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
			</View>
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
		this.getIncidentData(this.state.period).then(() => finished());
	}

	render(): React.JSX.Element {
		return (
			<View>
				<LoadingIcon visible={this.state.updating} verticalOffset={60} />

				<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
					{this.state.incidents === undefined ? this.noIncidentsRender() : this.incidentsRender(this.props.navigation)}
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
