import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { createStackNavigator } from '@react-navigation/stack';
import InformationCard from '../../components/InformationCard';
import NoteCard from '../../components/NoteCard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ScreenProps } from '../../../App';
import Incident from '../incident/Incident';
import { Alarm as AlarmData } from '../../components/incidentCard/IncidentCard';
import { MockDataGenerator } from '../../utility/MockDataGenerator';
import { getCurrentTheme } from '../../themes/ThemeManager';

const Stack = createStackNavigator();
interface AlarmState extends AlarmData {
	loading: boolean;
}

async function getAlarmData(id: number) {
	let promise: Promise<AlarmData> = new Promise((resolve): void => {
		setTimeout(() => {
			resolve(MockDataGenerator.getAlarm(id));
		}, 100);
	});
	return await promise;
}

class Alarm extends Component<ScreenProps, AlarmState> {
	private userName: string = 'Bent';
	state: AlarmState = {
		alarmError: 'Loading',
		alarmLog: '',
		alarmNote: 'string',
		service: '',
		loading: true,
		id: -1
	};

	componentDidMount() {
		this.getData();
	}

	constructor(props: ScreenProps) {
		super(props);
		this.state.id = this.props.route.params?.id;
	}

	private async getData() {
		await getAlarmData(this.props.route.params?.id).then((value) => {
			this.setState({
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
			<>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Content title={`${this.state.alarmError}`} />
			</>
		);
	}

	private alarmRender() {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<View style={container.activity}>
						<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					</View>
				) : (
					<View style={container.padding}>
						<InformationCard errorType={this.state.alarmError} errorInfo={this.state.alarmLog} />
						<NoteCard
							editable={true}
							noteInfo={this.state.alarmNote}
							onChange={(text: string) => {
								MockDataGenerator.updateAlarm(this.state.id, this.userName, { alarmNote: text });
								this.getData().then(() => this.forceUpdate());
							}}
						/>
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
	},
	activity: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Alarm;
