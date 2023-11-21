import React, { Component } from 'react';
import { Appbar, Card, Text } from 'react-native-paper';
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
import { MockDataGenerator, users } from '../../utility/MockDataGenerator';

interface IncidentState {
	incidentId: number;
	incidentData: IncidentType | undefined;
	loading: boolean;
	timer: number;
}

class Incident extends Component<ScreenProps, IncidentState> {
	state: IncidentState = {
		incidentId: -1,
		incidentData: undefined,
		loading: true,
		timer: 0
	};

	constructor(props: ScreenProps) {
		super(props);
		console.log(props.route.params);
		this.state.incidentId = props.route.params?.id;
	}

	private getIncidentData() {
		let incident = MockDataGenerator.getAllIncidents().filter((value) => value.id === this.state.incidentId);
		if (incident.length < 1) {
			console.log('No incident found with that id');
			return;
		} else {
			this.setState({ incidentData: incident.pop() });
		}
	}

	private async loadIncidentData() {
		let promise: Promise<boolean> = new Promise((resolve): void => {
			setTimeout(() => {
				this.getIncidentData();
				this.setState({ loading: false });
				resolve(true);
			}, 1000);
		});
		return await promise;
	}

	private timer() {
		setInterval(() => {
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

	private incidentsRender(): React.JSX.Element {
		if (this.state.incidentData === undefined) {
			return <Text>Error loading data</Text>;
		}
		return (
			<View style={{ width: '100%', height: '100%' }}>
				<FABResolved />
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={IncidentScreenStylesheet.incidentContainer}>
						<AddUser users={this.state.incidentData?.assignedUsers} type={'Assigned'} usersAll={users} removable={true} />
						<PrioritySelector state={this.state.incidentData?.priority} onPress={(value) => console.log(value)} />
						<AddUser users={this.state.incidentData?.assignedUsers} type={'Called'} usersAll={users} removable={false} />
						<NoteCard noteInfo={'bla bla bla'} onChange={(text) => console.log(text)} />
						<EventLogCard eventLog={[{ dateTime: Date.now(), user: 'Bent', message: 'Updated incident note' }]} />
						<Card style={IncidentScreenStylesheet.card}>
							<Text variant={'titleMedium'} style={IncidentScreenStylesheet.text}>
								Alarms
							</Text>
							<IncidentCardList
								alarms={this.state.incidentData?.alarms}
								onClickAlarm={(id) => this.props.navigation.navigate('Alarm', { id: id })}
							/>
						</Card>
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
				{this.state.loading ? <ActivityIndicator /> : this.incidentsRender()}
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
	}
});

export default Incident;
