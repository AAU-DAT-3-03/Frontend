import React, { Component } from 'react';
import {Appbar, Text} from 'react-native-paper';
import ContentContainer from "../../components/ContentContainer";

interface AlarmProps {
	alarm: string
}

interface AlarmState {
	alarm: string
}


class Alarm extends Component<AlarmProps, AlarmState> {
	state: AlarmState = {
		alarm: "Not defined"
	}

	constructor(props: AlarmProps) {
		super(props);
		this.state.alarm = props.alarm;
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction onPress={() => {}}/>
				<Appbar.Content title={this.state.alarm}/>
			</Appbar>
		);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<Text variant={"displayLarge"}>test</Text>
			</ContentContainer>
		);
	}
}

export default Alarm;
