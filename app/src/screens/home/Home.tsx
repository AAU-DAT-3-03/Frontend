import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { getCurrentTheme } from '../../themes/ThemeManager';
import AddUser, { User } from '../../components/AddUser';

const users: User[] = [{ name: 'Bent', team: 'Cloud', phoneNr: 12345678 }];

const usersAll: User[] = [
	{ name: 'Bent', team: 'Cloud', phoneNr: 12345678 },
	{ name: 'Bølle', team: 'Cloud', phoneNr: 12345678 },
	{ name: 'Mikkel', team: 'Server', phoneNr: 12345678 },
	{ name: 'Rasmus', team: 'Server', phoneNr: 12345678 },
	{ name: 'Sandra', team: 'Admin', phoneNr: 12345678 },
	{ name: 'Mads', team: 'Admin', phoneNr: 12345678 },
	{ name: 'Camilla', team: 'Database', phoneNr: 12345678 }
];

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
				<Text style={{ color: theme.colors.tertiary }} variant={'displayLarge'}>
					test
				</Text>
				<AddUser removable={true} type={'Assigned'} users={users} usersAll={usersAll} />
			</ContentContainer>
		);
	}
}

export default Home;
