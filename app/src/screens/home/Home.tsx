import React, { Component } from 'react';
import { Appbar, Switch, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import NotificationHandler from '../../utility/NotificationHandler';

class Home extends Component {
	state = {
		toggleNotifications: false
	};

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Home'} />
			</Appbar>
		);
	}

	private async toggleNotifications() {
		this.setState({ toggleNotifications: !this.state.toggleNotifications });
		// Set up the notification handler
		new NotificationHandler();
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<Text variant={'displayLarge'}>test</Text>
				<Switch value={this.state.toggleNotifications} onValueChange={() => this.toggleNotifications()}></Switch>
			</ContentContainer>
		);
	}
}

export default Home;
