import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { getCurrentTheme } from '../../themes/ThemeManager';
import AddUser, { User } from '../../components/AddUser';

const users: User[] = [{ name: 'Bent', phoneNr: 12345678 }];

const usersAll: User[] = [
	{ name: 'Bent', phoneNr: 12345678 },
	{ name: 'Ole', phoneNr: 12345678 },
	{ name: 'Benjamin', phoneNr: 12345678 },
	{ name: 'Nikolaj', phoneNr: 12345678 },
	{ name: 'Olivia', phoneNr: 12345678 },
	{ name: 'Kamilla', phoneNr: 12345678 },
	{ name: 'Caroline', phoneNr: 12345678 },
	{ name: 'Peter', phoneNr: 12345678 },
	{ name: 'Ib', phoneNr: 12345678 }
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
				<AddUser type={'Called'} users={users} usersAll={usersAll} />
			</ContentContainer>
		);
	}
}

export default Home;
