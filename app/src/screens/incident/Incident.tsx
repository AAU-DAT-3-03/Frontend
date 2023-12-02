import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import PrioritySelector from '../../components/PrioritySelector';
import EventLogCard from '../../components/EventLogCard';
import NoteCard from '../../components/NoteCard';
import AddUser from '../../components/AddUser';
import FABResolved from '../../components/FABResolved';
import { IncidentCardList } from '../../components/incidentCard/IncidentCard';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../../components/ContainerCard';
import MergeIncident from '../../components/MergeIncident';
import { IncidentData, UpdateIncident, UserResponse } from '../../utility/DataHandlerTypes';
import DataHandler from '../../utility/DataHandler';
import LocalStorage from '../../utility/LocalStorage';
import Logger from '../../utility/Logger';

interface IncidentState {
	incidentId: string;
	incidentData: IncidentData | undefined;
	loading: boolean;
	users: UserResponse[];
}

class Incident extends Component<ScreenProps, IncidentState> {
	private userName: string = LocalStorage.getSettingsValue('username');
	private logger: Logger = new Logger('IncidentScreen');

	state: IncidentState = {
		incidentId: this.props.route.params?.id ?? '',
		incidentData: undefined,
		loading: true,
		users: []
	};

	constructor(props: ScreenProps) {
		super(props);
		this.loadIncidentData();
	}

	private async loadIncidentData(): Promise<void> {
		this.logger.info(`Loading data for: ${this.state.incidentId}`);
		let incidentData: IncidentData | undefined = await DataHandler.getIncidentData(this.state.incidentId);
		if (incidentData === undefined) {
			this.logger.error('No data received');
			this.setState({ loading: false });
			return;
		}
		this.logger.info(`Rendering data`);

		DataHandler.getUsers().then((value: UserResponse[]) => {
			this.setState({ users: value });
		});

		this.setState({
			incidentData: incidentData,
			loading: false
		});
	}

	private AppBar(): React.JSX.Element {
		const formattedDate = this.state.incidentData
			? new Date(this.state.incidentData.creationDate).toLocaleDateString([], { hour: '2-digit', minute: '2-digit', hour12: false })
			: null;

		return (
			<>
				<View style={IncidentScreenStylesheet.header}>
					<View style={IncidentScreenStylesheet.insideHeader}>
						<Appbar.BackAction
							onPress={() => {
								this.props.navigation.goBack();
							}}
						/>
					</View>
					<View style={IncidentScreenStylesheet.insideHeaderCenter}>
						{this.state.loading ? null : (
							<View>
								<Text variant={'titleLarge'}>
									{this.state.incidentData?.companyName} #{this.state.incidentData?.caseNumber}
								</Text>
							</View>
						)}
					</View>
					<View style={IncidentScreenStylesheet.insideHeader}>
						<Text>{formattedDate}</Text>
					</View>
				</View>
			</>
		);
	}

	private updateIncidentData(data: UpdateIncident): void {
		DataHandler.updateIncidentData(data).then(() => this.loadIncidentData());
	}

	private incidentsRender(): React.JSX.Element {
		if (this.state.incidentData === undefined) {
			return <Text>Error loading data</Text>;
		}
		let editable: boolean = !this.state.incidentData.resolved;
		return (
			<View style={{ width: '100%', height: '100%' }}>
				{editable ? (
					<FABResolved
						onResolve={() => {
							this.updateIncidentData({ id: this.state.incidentId, resolved: true });
						}}
					/>
				) : null}
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={IncidentScreenStylesheet.incidentContainer}>
						<AddUser
							editable={editable}
							users={this.state.incidentData?.users}
							type={'Assigned'}
							usersAll={this.state.users}
							removable={true}
							onAdd={(user) => {
								this.updateIncidentData({ id: this.state.incidentId, addUsers: [user] });
							}}
							onRemove={(user) => this.updateIncidentData({ id: this.state.incidentId, removeUsers: [user] })}
						/>
						<PrioritySelector
							editable={editable}
							state={this.state.incidentData?.priority}
							onPress={(value) => this.updateIncidentData({ id: this.state.incidentId, priority: value })}
						/>
						<AddUser
							editable={editable}
							users={this.state.incidentData?.calls}
							type={'Called'}
							usersAll={this.state.users}
							removable={false}
							onAdd={(user) => this.updateIncidentData({ id: this.state.incidentId, addCalls: [user] })}
						/>
						<ContainerCard style={{ paddingBottom: 0 }}>
							<ContainerCard.Content>
								<Text variant={'titleMedium'} style={IncidentScreenStylesheet.text}>
									Alarms
								</Text>
								<IncidentCardList
									alarms={this.state.incidentData?.alarms}
									onClickAlarm={(id) => this.props.navigation.navigate('Alarm', { id: id })}
								/>
							</ContainerCard.Content>
						</ContainerCard>
						<NoteCard
							title={'incident'}
							editable={editable}
							noteInfo={this.state.incidentData?.incidentNote}
							onChange={(text) => this.updateIncidentData({ id: this.state.incidentId, incidentNote: text })}
						/>
						{editable ? (
							<MergeIncident
								incident={this.state.incidentData}
								user={this.userName}
								id={this.state.incidentId}
								onMerge={() => this.loadIncidentData().then(() => this.forceUpdate())}
							/>
						) : null}
						{this.state.incidentData.eventLog !== undefined ? (
							<EventLogCard eventLog={this.state.incidentData?.eventLog} />
						) : null}
					</View>
				</ScrollView>
			</View>
		);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<View style={IncidentScreenStylesheet.activity}>
						<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					</View>
				) : (
					this.incidentsRender()
				)}
			</ContentContainer>
		);
	}
}

const IncidentScreenStylesheet = StyleSheet.create({
	incidentContainer: {
		padding: 16,
		flexDirection: 'column',
		gap: 16
	},
	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center'
	},
	insideHeader: {
		width: '25%'
	},
	insideHeaderCenter: {
		width: '50%',
		alignItems: 'center'
	},
	card: {
		borderRadius: 16,
		paddingTop: 15,
		backgroundColor: getCurrentTheme().colors.elevation.level2
	},
	text: {
		alignSelf: 'center',
		paddingBottom: 8
	},
	activity: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Incident;
