import React, { Component } from 'react';
import { Card, IconButton, Portal, Text, Modal, Searchbar, TouchableRipple, Icon } from 'react-native-paper';
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
		flexDirection: 'column',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.elevation.level2,
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
	removable: boolean;
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
							style={addUserStyle.searchbar}
							placeholder={'Search User'}
							mode={'view'}
							icon={'account-search'}
							showDivider={true}
							value={this.state.query}
							onChange={(e) => this.setState({ query: e.nativeEvent.text })}
						/>
						<FlatList
							style={{ width: '100%' }}
							data={this.props.users
								.filter(
									(value) =>
										value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 ||
										value.team.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1
								)
								.sort((user1, user2) => user1.name.localeCompare(user2.name))}
							renderItem={(info) => {
								return (
									<TouchableRipple onPress={() => this.props.onDismiss(info.item)}>
										<View style={addUserStyle.buttons}>
											<View style={addUserStyle.icon}>
												<Icon size={22} source={'account'} />
											</View>
											<Text>
												{info.item.name} - {info.item.team}
											</Text>
										</View>
									</TouchableRipple>
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
	team: string;
	phoneNr: number;
};

interface AddUserProps {
	type: string;
	usersAll: User[];
	users: User[];
	removable: boolean;
	onRemove?: (user: User) => void;
	onAdd?: (user: User) => void;
	editable: boolean;
}

interface AddUserState {
	assignVisible: boolean;
	users: User[];
}

class AddUser extends Component<AddUserProps, AddUserState> {
	state: AddUserState = { assignVisible: false, users: [] };

	constructor(props: AddUserProps) {
		super(props);
	}

	private onDeleteUser(user: User): void {
		if (this.props.onRemove !== undefined) this.props.onRemove(user);
	}

	render(): React.JSX.Element {
		return (
			<Card style={addUserStyle.card}>
				<Card.Content style={addUserStyle.cardContent}>
					<Text variant={'titleSmall'} style={{ color: getCurrentTheme().colors.onSurface }}>
						{this.props.type}
					</Text>
					<View style={addUserStyle.users}>
						{this.props.users?.map((user: User, key: number) => {
							return (
								<UserAvatar
									team={user.team}
									key={key}
									name={user.name}
									phoneNr={user.phoneNr}
									onDelete={
										this.props.removable && this.props.editable
											? (user: User) => {
													this.onDeleteUser(user);
											  }
											: undefined
									}
								/>
							);
						})}
					</View>

					{this.props.editable ? (
						<>
							<IconButton
								icon="plus-circle"
								iconColor={getCurrentTheme().colors.primary}
								size={30}
								onPress={() => this.setState({ assignVisible: true })}
								style={{}}
							/>
							<AssignUser
								removable={this.props.removable}
								visible={this.state.assignVisible}
								onDismiss={(user: User | undefined): void => {
									if (user !== undefined) this.addUser(user);
									this.setState({ assignVisible: false });
								}}
								users={this.props.usersAll}
							/>
						</>
					) : null}
				</Card.Content>
			</Card>
		);
	}

	private addUser(user: User): void {
		let users: User[] = this.state.users.filter((value: User) => {
			return value.name === user.name && value.phoneNr === user.phoneNr;
		});
		if (users.length > 0) return;
		if (this.props.onAdd !== undefined) this.props.onAdd(user);
	}
}

const addUserStyle = StyleSheet.create({
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		gap: 16,
		alignItems: 'center'
	},
	card: {
		backgroundColor: getCurrentTheme().colors.elevation.level2,
		height: 'auto',
		width: '100%',
		shadowColor: 'transparent'
	},
	users: {
		height: 'auto',
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8
	},
	buttons: {
		flexDirection: 'row',
		textAlign: 'left',
		padding: 0,
		margin: 0,
		width: '100%',
		paddingVertical: 8,
		alignItems: 'center',
		paddingHorizontal: 4
	},
	icon: {
		padding: 2,
		marginLeft: 6
	},
	searchbar: {
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		backgroundColor: getCurrentTheme().colors.elevation.level4
	}
});
export default AddUser;
