import React, { Component } from 'react';
import {Appbar, Text} from 'react-native-paper';
import {ScrollView} from "react-native";
import ContentContainer from "../../components/ContentContainer";

class Services extends Component {

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={"Services"}/>
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

export default Services;
