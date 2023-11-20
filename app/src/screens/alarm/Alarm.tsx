import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';

interface AlarmState {
	alarm: string;
}

class Alarm extends Component<ScreenProps, AlarmState> {
	state: AlarmState = {
		alarm: 'Not defined'
	};

	constructor(props: ScreenProps) {
		super(props);
		this.state.alarm = props.route.params?.alarm;
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

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<Text variant={'displayLarge'}>{this.state.alarm}</Text>
			</ContentContainer>
		);
	}
}

export default Alarm;
