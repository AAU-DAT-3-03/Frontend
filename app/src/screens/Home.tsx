import React, { Component } from 'react';
import { Text } from 'react-native-paper';

interface HomeProps {
	text: string;
}

class Home extends Component<HomeProps> {
	render(): React.JSX.Element {
		return <Text>{this.props.text}</Text>;
	}
}

export default Home;
