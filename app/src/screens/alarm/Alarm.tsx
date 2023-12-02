import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { createStackNavigator } from '@react-navigation/stack';
import InformationCard from '../../components/InformationCard';
import NoteCard from '../../components/NoteCard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppRender, ScreenProps } from '../../../App';
import Incident from '../incident/Incident';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { AlarmResponse } from '../../utility/DataHandlerTypes';
import DataHandler from '../../utility/DataHandler';

const Stack = createStackNavigator();
interface AlarmState {
	alarm: AlarmResponse | undefined;
	loading: boolean;
	id: string;
}

class Alarm extends Component<ScreenProps, AlarmState> {
	state: AlarmState = {
		alarm: undefined,
		id: this.props.route.params?.id,
		loading: true
	};

	componentDidMount() {
		this.getAlarmData();
	}

	/**
	 * @todo Implement this
	 * @private
	 */
	private async getAlarmData() {
		DataHandler.getAlarmData(this.state.id);
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Appbar.BackAction
					onPress={() => {
						AppRender.home?.refresh();
						AppRender.history?.refresh();
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Content title={`${this.state.alarm?.name}`} />
			</>
		);
	}

	private async updateAlarm(text: string): Promise<void> {}

	/**
	 * @todo add alarm log/note
	 * @private
	 */
	private alarmRender() {
		return (
			<ContentContainer
				appBar={this.AppBar()}
				onRefresh={async (finished): Promise<void> => {
					await this.getAlarmData();
					finished();
				}}
			>
				{this.state.loading ? (
					<View style={container.activity}>
						<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					</View>
				) : (
					<View style={container.padding}>
						<InformationCard errorType={this.state.alarm?.name ?? ''} errorInfo={this.state.alarm?.name ?? ''} />
						<NoteCard
							title={'alarm'}
							editable={true}
							noteInfo={this.state.alarm?.name ?? ''}
							onChange={(text: string) => {
								this.updateAlarm(text);
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
