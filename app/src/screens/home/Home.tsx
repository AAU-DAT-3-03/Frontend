import React, { Component } from 'react';
import { Appbar, MD3Theme, Text, useTheme } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import Dial from '../../components/Dial';

interface HomeProps {
	theme: MD3Theme;
}

class HomeClass extends Component<HomeProps> {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Home'} />
			</Appbar>
		);
	}
	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<Text variant={'displayLarge'}>test</Text>
				<Dial percentage={70} scale={3} header={'Cpu'} subHeader={'30%'} />
			</ContentContainer>
		);
	}
}

/**
 * To import theme
 * @todo find better solution
 * @constructor
 */
export default function Home(): React.JSX.Element {
	const theme: MD3Theme = useTheme();
	return <HomeClass theme={theme} />;
}
