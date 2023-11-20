import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScreenProps } from '../../../App';

interface IncidentState {
	alarm: string;
}

class Incident extends Component<ScreenProps, IncidentState> {
	state: IncidentState = {
		alarm: 'Not defined'
	};

	constructor(props: ScreenProps) {
		super(props);
		console.log(props);
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

export default Incident;
