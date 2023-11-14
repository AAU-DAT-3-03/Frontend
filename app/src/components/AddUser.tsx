import React, { Component } from 'react';
import { Card, IconButton, Portal, Text, Modal, Searchbar, Button } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { FlatList, StyleSheet, View } from 'react-native';
import UserAvatar from './UserAvatar';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	view: {
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		width: 256,
		height: 512
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	}
});

interface AssignUserProps {
	users: User[];
	visible: boolean;
	onDismiss: (user: User | undefined) => void;
}

class AssignUser extends Component<AssignUserProps> {
	state = {
		query: ''
	};

	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss(undefined)}>
					<View style={styles.view}>
						<Searchbar
							placeholder={'User'}
							mode={'view'}
							icon={'account'}
							showDivider={true}
							value={this.state.query}
							onChange={(e) => this.setState({ query: e.nativeEvent.text })}
						/>
						<FlatList
							data={this.props.users.filter(
								(value) => value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1
							)}
							renderItem={(info) => {
								return (
									<Button icon={'account'} onPress={() => this.props.onDismiss(info.item)}>
										{info.item.name}
									</Button>
								);
							}}
						/>
					</View>
				</Modal>
			</Portal>
		);
	}
}

export type User = {
	name: string;
	phoneNr: number;
};

interface AddUserProps {
	type: string;
	usersAll: User[];
	users?: User[];
}

interface AddUserState {
	assignVisible: boolean;
	users: User[];
}

class AddUser extends Component<AddUserProps, AddUserState> {
	state: AddUserState = { assignVisible: false, users: [] };

	constructor(props: AddUserProps) {
		super(props);
		this.state.users = props.users ?? this.state.users;
	}

	private onDeleteUser(user: User): void {
		let users: User[] = this.state.users.filter((value: User) => {
			if (value.name === user.name && value.phoneNr === user.phoneNr) return false;
			return true;
		});
		this.setState({ users: users });
	}

	render(): React.JSX.Element {
		return (
			<Card style={addUserStyle.card}>
				<Card.Content style={addUserStyle.cardContent}>
					<Text style={{ color: getCurrentTheme().colors.onSurface }}>{this.props.type}</Text>
					<View style={addUserStyle.users}>
						{this.state.users?.map((user: User, key: number) => {
							return (
								<UserAvatar
									key={key}
									name={user.name}
									phoneNr={user.phoneNr}
									onDelete={(user: User) => this.onDeleteUser(user)}
								/>
							);
						})}
					</View>

					<IconButton
						icon="plus-circle"
						iconColor={getCurrentTheme().colors.primary}
						size={30}
						onPress={() => this.setState({ assignVisible: true })}
						style={{}}
					/>
					<AssignUser
						visible={this.state.assignVisible}
						onDismiss={(user: User | undefined): void => {
							if (user !== undefined) this.addUser(user);
							this.setState({ assignVisible: false });
						}}
						users={this.props.usersAll}
					></AssignUser>
				</Card.Content>
			</Card>
		);
	}

	private addUser(user: User): void {
		let users: User[] = this.state.users.filter((value: User) => {
			if (value.name === user.name && value.phoneNr === user.phoneNr) return true;
			return false;
		});
		if (users.length > 0) return;
		this.state.users.push(user);
	}
}

const addUserStyle = StyleSheet.create({
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		gap: 8,
		alignItems: 'center',
		padding: 8
	},
	card: {
		backgroundColor: getCurrentTheme().colors.surface,
		borderWidth: 1,
		borderColor: 'grey',
		height: 'auto',
		width: '100%'
	},
	users: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		gap: 8
	}
});

export default AddUser;
