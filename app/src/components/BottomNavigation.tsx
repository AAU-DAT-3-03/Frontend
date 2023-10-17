import React, { Component } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from '../screens/Home';

interface BNBState {
	index: number;
	routes: { key: string; title: string; focusedIcon: string }[];
}

class BottomNavigationBar extends Component<any, BNBState> {
	state = {
		index: 0,
		routes: [
			{ key: 'overview', title: 'Overview', focusedIcon: 'view-list' },
			{ key: 'home', title: 'Home', focusedIcon: 'home' },
			{ key: 'history', title: 'History', focusedIcon: 'history' }
		]
	};

	private setIndex(index: number): void {
		this.setState({ index: index });
	}

	render(): React.JSX.Element {
		const renderScene = BottomNavigation.SceneMap({
			overview: () => <Home text={'Overview'} />,
			home: () => <Home text={'Home'} />,
			history: () => <Home text={'History'} />
		});

		return (
			<BottomNavigation
				navigationState={{ index: this.state.index, routes: this.state.routes }}
				onIndexChange={(index) => this.setIndex(index)}
				renderScene={renderScene}
			/>
		);
	}
}

export default BottomNavigationBar;
