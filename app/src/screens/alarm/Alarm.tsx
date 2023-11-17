import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import InformationCard from '../../components/InformationCard';
import NoteCard from '../../components/NoteCard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface AlarmData {
	alarm: string;
	alarmError: string;
	alarmLog: string;
	alarmNote: string;
	service: string;
}

interface AlarmProps {
	id: number;
}

interface AlarmState extends AlarmData {
	loading: boolean;
}

async function getAlarmData(id: number) {
	let promise: Promise<AlarmData> = new Promise((resolve): void => {
		setTimeout(() => {
			let alarmdata: AlarmData = {
				alarm: 'BOOBA',
				alarmError: 'errror 404',
				alarmLog: 'shit not good',
				alarmNote: 'fix det habibi',
				service: 'gurli gris'
			};
			resolve(alarmdata);
		}, 3);
	});
	return await promise;
}

class Alarm extends Component<AlarmProps, AlarmState> {
	state: AlarmState = {
		alarm: 'Loading',
		alarmError: '',
		alarmLog: '',
		alarmNote: 'string',
		service: '',
		loading: true
	};

	componentDidMount() {
		getAlarmData(this.props.id).then((value) =>
			this.setState({
				alarm: value.alarm,
				alarmError: value.alarmError,
				alarmLog: value.alarmLog,
				alarmNote: value.alarmNote,
				service: value.service,
				loading: false
			})
		);
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction onPress={() => {}} />
				<Appbar.Content title={this.state.alarm} />
			</Appbar>
		);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<ActivityIndicator></ActivityIndicator>
				) : (
					<View style={container.padding}>
						<InformationCard errorType={this.state.alarm} errorInfo={this.state.alarmLog}></InformationCard>
						<NoteCard noteInfo={this.state.alarmNote} onChange={() => {}}></NoteCard>
					</View>
				)}
			</ContentContainer>
		);
	}
}

const container = StyleSheet.create({
	padding: {
		flexDirection: 'column',
		gap: 16,
		padding: 16
	}
});

export default Alarm;
