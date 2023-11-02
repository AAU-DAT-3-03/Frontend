import React, { Component } from 'react';
import { Appbar, Button } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import TimePicker from '../../components/TimePicker';

class Home extends Component {
	state = {
		timePickerVisible: false
	};

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Home'} />
			</Appbar>
		);
	}

	private onRefresh(finished: () => void): void {
		setTimeout(() => finished(), 5000);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={this.onRefresh}>
				<Button onPress={() => this.setState({ timePickerVisible: true })}>Show Time Picker</Button>
				<TimePicker visible={this.state.timePickerVisible} onDismiss={() => this.setState({ timePickerVisible: false })} />
			</ContentContainer>
		);
	}
}

export default Home;
