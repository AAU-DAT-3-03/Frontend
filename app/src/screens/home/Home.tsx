import React, { Component } from 'react';
import {Appbar, Text} from 'react-native-paper';
import ContentContainer from "../../components/ContentContainer";

class Home extends Component {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={"Home"}/>
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

export default Home;
