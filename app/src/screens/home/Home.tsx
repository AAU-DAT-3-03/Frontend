import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { getCurrentTheme } from '../../themes/ThemeManager';
import CompanyCard from '../../components/CompanyCard';

class Home extends Component {
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
		let theme: any = getCurrentTheme();
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={this.onRefresh}>
				<CompanyCard company={'Jysk'} state={2} />
			</ContentContainer>
		);
	}
}

export default Home;
