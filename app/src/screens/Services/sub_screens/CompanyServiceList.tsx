import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../../components/ContentContainer';
import { ScreenProps } from '../../../../App';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import IncidentCard, { IncidentType } from '../../../components/incidentCard/IncidentCard';
import { MockDataGenerator } from '../../../utility/MockDataGenerator';
import { getCurrentTheme } from '../../../themes/ThemeManager';
import { compareIncident } from '../../home/Home';

interface CompanyServiceLisState {
	company: string;
	id: number;
	loading: boolean;
	incidents: IncidentType[];
}

class CompanyServiceList extends Component<ScreenProps, CompanyServiceLisState> {
	state: CompanyServiceLisState = {
		company: this.props.route.params?.company,
		id: this.props.route.params?.id,
		loading: false,
		incidents: []
	};

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<View>
					<Text style={cslStyle().headerText} variant={'titleLarge'}>
						{this.state.company}
					</Text>
				</View>
			</>
		);
	}

	componentDidMount() {
		this.getIncidentData();
	}

	public refresh(): void {
		this.getIncidentData();
	}

	/**
	 * @todo Get data from server instead
	 * @private
	 */
	private async getIncidentData(): Promise<boolean> {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				let incidentsSorted = this.sortIncidents(
					MockDataGenerator.getAllIncidents().filter((value) => value.state !== 'resolved' && value.companyId === this.state.id)
				);
				console.log(incidentsSorted);
				this.setState({ loading: false, incidents: incidentsSorted });
				resolve(true);
			}, 100);
		});
		return await promise;
	}

	private onRefresh(finished: () => void): void {
		MockDataGenerator.generateIncident();
		this.getIncidentData().then(() => finished());
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
			<View style={cslStyle().noIncidentContainer}>
				{this.state.loading ? (
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
				) : (
					<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.elevation.level4 }}>
						No active incidents
					</Text>
				)}
			</View>
		);
	}

	private incidentsRender(navigation: any): React.JSX.Element {
		return (
			<View style={cslStyle().incidentContainer}>
				{this.state.incidents.map((value, index) => {
					return (
						<IncidentCard
							key={index}
							incident={value}
							onClickIncident={(id) =>
								navigation.navigate('IncidentCompanies', {
									id: id
								})
							}
							onClickAlarm={(id) =>
								navigation.navigate('AlarmCompanies', {
									id: id
								})
							}
						/>
					);
				})}
			</View>
		);
	}

	render(): React.JSX.Element {
		return (
			<>
				<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
					{this.state.loading || this.state.incidents.length < 1
						? this.noIncidentsRender()
						: this.incidentsRender(this.props.navigation)}
				</ContentContainer>
			</>
		);
	}
}

const cslStyle = () => {
	return StyleSheet.create({
		headerText: {
			width: '100%',
			paddingRight: 110,
			textAlign: 'center'
		},
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

export default CompanyServiceList;
