import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';
import { IncidentType } from '../../components/incidentCard/IncidentCard';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import PrioritySelector from '../../components/PrioritySelector';
import EventLogCard from '../../components/EventLogCard';
import NoteCard from '../../components/NoteCard';
import AddUser from '../../components/AddUser';
import FABResolved from '../../components/FABResolved';
import { IncidentCardList } from '../../components/incidentCard/IncidentCard';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { MockDataGenerator, UpdateIncidentData, users } from '../../utility/MockDataGenerator';
import ContainerCard from '../../components/ContainerCard';
import Home from '../home/Home';
import History from '../history/History';
import MergeIncident from '../../components/MergeIncident';

interface IncidentState {
	incidentId: number;
	incidentData: IncidentType | undefined;
	loading: boolean;
	timer: number;
}

class Incident extends Component<ScreenProps, IncidentState> {
	private userName: string = 'Bent';
	private counter: NodeJS.Timeout | undefined;
	state: IncidentState = {
		incidentId: -1,
		incidentData: undefined,
		loading: true,
		timer: 0
	};

	constructor(props: ScreenProps) {
		super(props);
		this.state.incidentId = props.route.params?.id;
	}

	private getIncidentData() {
		let incidents = MockDataGenerator.getAllIncidents().filter((value) => value.id === this.state.incidentId);
		if (incidents.length < 1) {
			console.log('No incident found with that id');
			return;
		} else {
			let incident = incidents.pop();
			this.setState({ incidentData: incident, timer: Math.floor((Date.now() - (incident?.startTime ?? Date.now())) / 60000) });
		}
	}

	private async loadIncidentData() {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				this.getIncidentData();
				this.setState({ loading: false });
				resolve(true);
			}, 100);
		});
		return await promise;
	}

	private timer() {
		this.counter = setInterval(() => {
			this.setState({ timer: this.state.timer + 1 });
		}, 60000);
	}

	private formatTimer(timer: number): string {
		const hours = Math.floor(timer / 60);
		const minutes = timer % 60;
		return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Appbar.BackAction
					onPress={() => {
						if (Home.instance !== undefined) Home.instance.refresh();
						if (History.instance !== undefined) History.instance.refresh();
						this.props.navigation.goBack();
					}}
				/>
				<View>
					{this.state.loading ? null : (
						<View style={IncidentScreenStylesheet.header}>
							<Text variant={'titleLarge'}>
								{this.state.incidentData?.company} #{this.state.incidentData?.caseNr}
							</Text>
							<Text>{this.formatTimer(this.state.timer)}</Text>
						</View>
					)}
				</View>
			</>
		);
	}

	private updateIncidentData(data: UpdateIncidentData) {
		if (this.state.incidentData?.state === 'resolved') return;
		MockDataGenerator.updateIncident(this.state.incidentId, this.userName, data);
		this.loadIncidentData().then(() => this.forceUpdate());
	}

	private incidentsRender(): React.JSX.Element {
		if (this.state.incidentData === undefined) {
			return <Text>Error loading data</Text>;
		}
		let editable: boolean = this.state.incidentData.state !== 'resolved';
		if (!editable && this.counter !== undefined) {
			clearTimeout(this.counter);
			this.counter = undefined;
		}
		return (
			<View style={{ width: '100%', height: '100%' }}>
				{editable ? (
					<FABResolved
						onResolve={() => {
							this.updateIncidentData({ state: 'resolved' });
						}}
					/>
				) : null}
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={IncidentScreenStylesheet.incidentContainer}>
						<AddUser
							editable={editable}
							users={this.state.incidentData?.assignedUsers}
							type={'Assigned'}
							usersAll={users}
							removable={true}
							onAdd={(user) => {
								this.updateIncidentData({ assignUser: user });
							}}
							onRemove={(user) => this.updateIncidentData({ unAssignUser: user })}
						/>
						<PrioritySelector
							editable={editable}
							state={this.state.incidentData?.priority}
							onPress={(value) => this.updateIncidentData({ priority: value })}
						/>
						<AddUser
							editable={editable}
							users={this.state.incidentData?.calledUsers}
							type={'Called'}
							usersAll={users}
							removable={false}
							onAdd={(user) => this.updateIncidentData({ calledUser: user })}
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
							onChange={(text) => this.updateIncidentData({ incidentNote: text })}
						/>
						{editable ? (
							<MergeIncident
								user={this.userName}
								id={this.state.incidentId}
								onMerge={() => this.loadIncidentData().then(() => this.forceUpdate())}
							/>
						) : null}
						<EventLogCard eventLog={this.state.incidentData?.eventLog} />
					</View>
				</ScrollView>
			</View>
		);
	}

	componentDidMount() {
		this.loadIncidentData();
		this.timer();
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
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		width: '100%',
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
