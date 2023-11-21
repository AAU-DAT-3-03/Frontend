import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { createStackNavigator } from '@react-navigation/stack';
import InformationCard from '../../components/InformationCard';
import NoteCard from '../../components/NoteCard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ScreenProps } from '../../../App';
import Incident from '../incident/Incident';

const Stack = createStackNavigator();
interface AlarmData {
	alarm: string;
	alarmError: string;
	alarmLog: string;
	alarmNote: string;
	service: string;
}

interface AlarmState extends AlarmData {
	loading: boolean;
}

async function getAlarmData(id: number | undefined) {
	if (id === undefined) return undefined;
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
		}, 1500);
	});
	return await promise;
}

class Alarm extends Component<ScreenProps, AlarmState> {
	state: AlarmState = {
		alarm: 'Loading',
		alarmError: '',
		alarmLog: '',
		alarmNote: 'string',
		service: '',
		loading: true
	};

	componentDidMount() {
		getAlarmData(this.props.route.params?.id).then((value) => {
			if (value === undefined) return;
			this.setState({
				alarm: value.alarm,
				alarmError: value.alarmError,
				alarmLog: value.alarmLog,
				alarmNote: value.alarmNote,
				service: value.service,
				loading: false
			});
		});
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Content title={this.state.alarm} />
			</Appbar>
		);
	}

	private alarmRender() {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<ActivityIndicator />
				) : (
					<View style={container.padding}>
						<InformationCard errorType={this.state.alarm} errorInfo={this.state.alarmLog} />
						<NoteCard noteInfo={this.state.alarmNote} onChange={() => {}} />
					</View>
				)}
			</ContentContainer>
		);
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'ServiceRender'}>
				<Stack.Screen options={{ headerShown: false }} name="alarmRender">
					{() => this.alarmRender()}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="incident">
					{(props: ScreenProps) => <Incident {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
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
