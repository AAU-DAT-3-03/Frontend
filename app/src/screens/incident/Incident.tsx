import React, { Component } from 'react';
import { Appbar, Card, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';
import { incidents } from '../home/Home';
import { IncidentType } from '../../components/incidentCard/IncidentCard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PrioritySelector from '../../components/PrioritySelector';
import EventLogCard from '../../components/EventLogCard';
import NoteCard from '../../components/NoteCard';
import AddUser from '../../components/AddUser';
import { users } from '../home/IncidentGenerator';
import FABResolved from '../../components/FABResolved';
import { IncidentCardList } from '../../components/incidentCard/IncidentCard';
import { getCurrentTheme } from '../../themes/ThemeManager';

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
		this.state.incidentId = props.route.params?.alarm;
	}

	private getIncidentData() {
		let incident = incidents.filter((value) => value.id === this.state.incidentId);
		if (incident.length < 1) {
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
			<Appbar>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Header>
					{this.state.loading ? null : (
						<View style={IncidentScreenStylesheet.header}>
							<Text variant={'titleLarge'}>
								{this.state.incidentData?.company} #{this.state.incidentData?.caseNr}
							</Text>
							<Text>{this.formatTimer(this.state.timer)}</Text>
						</View>
					)}
				</Appbar.Header>
			</Appbar>
		);
	}

	private incidentsRender(): React.JSX.Element {
		return (
			<View style={IncidentScreenStylesheet.incidentContainer}>
				<AddUser users={this.state.incidentData?.users} type={'Assigned'} usersAll={users} removable={true} />
				<PrioritySelector state={this.state.incidentData?.priority} onPress={(value) => console.log(value)} />
				<AddUser users={this.state.incidentData?.users} type={'Called'} usersAll={users} removable={false} />
				<NoteCard noteInfo={'bla bla bla'} onChange={(text) => console.log(text)} />
				<EventLogCard eventLog={[{ dateTime: Date.now(), user: 'Bent', message: 'Updated incident note' }]} />
				<FABResolved />
				<Card style={IncidentScreenStylesheet.card}>
					<Text variant={'titleMedium'} style={IncidentScreenStylesheet.text}>
						Alarms
					</Text>
					<IncidentCardList alarms={this.state.incidentData?.alarms} onClickAlarm={(id) => console.log(id)} />
				</Card>
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
