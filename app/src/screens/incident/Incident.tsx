import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';

interface IncidentProps {
	alarm: string;
}

interface IncidentState {
	alarm: string;
}

class Incident extends Component<IncidentProps, IncidentState> {
	state: IncidentState = {
		alarm: 'Not defined'
	};

	constructor(props: IncidentProps) {
		super(props);
		this.state.alarm = props.alarm;
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
				<Text variant={'displayLarge'}>test</Text>
			</ContentContainer>
		);
	}
}

export default Incident;
