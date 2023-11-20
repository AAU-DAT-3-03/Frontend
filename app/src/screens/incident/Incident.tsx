import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';
import { incidents } from '../home/Home';
import { IncidentType } from '../../components/incidentCard/IncidentCard';
import { IncidentGenerator } from '../home/IncidentGenerator';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PrioritySelector from '../../components/PrioritySelector';
import EventLogCard from '../../components/EventLogCard';
import NoteCard from '../../components/NoteCard';
import AddUser from '../../components/AddUser';
import { users } from '../home/IncidentGenerator';
import FABResolved from '../../components/FABResolved';

interface IncidentState {
	incidentId: number;
	incidentData: IncidentType | undefined;
	loading: boolean;
}

class Incident extends Component<ScreenProps, IncidentState> {
	state: IncidentState = {
		incidentId: -1,
		incidentData: undefined,
		loading: true
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

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Header style={IncidentScreenStylesheet.header}>
					{this.state.loading ? null : (
						<Text>
							{this.state.incidentData?.company} #{this.state.incidentData?.caseNr}
						</Text>
					)}
				</Appbar.Header>
			</Appbar>
		);
	}

	private incidentsRender(): React.JSX.Element {
		return (
			<View style={IncidentScreenStylesheet.incidentContainer}>
				<Text variant={'displayLarge'}>{this.state.incidentId}</Text>
				<Text variant={'displayLarge'}>{this.state.incidentData?.company}</Text>
				<AddUser users={this.state.incidentData?.users} type={'Assigned'} usersAll={users} removable={true} />
				<PrioritySelector state={this.state.incidentData?.priority} onPress={(value) => console.log(value)} />
				<AddUser users={this.state.incidentData?.users} type={'Called'} usersAll={users} removable={false} />
				<NoteCard noteInfo={'bla bla bla'} onChange={(text) => console.log(text)} />
				<EventLogCard eventLog={[{ dateTime: Date.now(), user: 'Bent', message: 'Updated incident note' }]} />
				<FABResolved />
			</View>
		);
	}

	componentDidMount() {
		this.loadIncidentData();
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
		justifyContent: 'center',
		flexDirection: 'row',
		width: '100%',
		paddingLeft: 35
	}
});

export default Incident;
