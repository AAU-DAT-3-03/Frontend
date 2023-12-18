import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import InformationCard from '../../components/InformationCard';
import { StyleSheet, View } from 'react-native';
import { AppRender, ScreenProps } from '../../../App';
import { AlarmResponse } from '../../utility/DataHandlerTypes';

interface AlarmState {
	alarm: AlarmResponse | undefined;
	id: string;
}

/**
 * Renders the Alarm Screen with relevant information
 */
class Alarm extends Component<ScreenProps, AlarmState> {
	state: AlarmState = {
		alarm: this.props.route.params?.alarm,
		id: this.props.route.params?.id
	};

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
				<Appbar.Content title={`${this.state.alarm?.serviceName}`} />
			</>
		);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<View style={container.padding}>
					<InformationCard errorType={this.state.alarm?.name ?? ''} errorInfo={this.state.alarm?.name ?? ''} />
				</View>
			</ContentContainer>
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
