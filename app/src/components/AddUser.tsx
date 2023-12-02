import React, { Component } from 'react';
import { Card, IconButton, Portal, Text, Modal, Searchbar, TouchableRipple, Icon } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { FlatList, StyleSheet, View } from 'react-native';
import UserAvatar from './UserAvatar';
import { UserResponse } from '../utility/DataHandlerTypes';

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
	users: UserResponse[];
	visible: boolean;
	onDismiss: (user: UserResponse | undefined) => void;
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
										(value.team !== undefined &&
											value.team.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1)
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

interface AddUserProps {
	type: string;
	usersAll: UserResponse[];
	users: UserResponse[];
	removable: boolean;
	onRemove?: (user: string, name: string) => void;
	onAdd?: (user: string, name: string) => void;
	editable: boolean;
}

interface AddUserState {
	assignVisible: boolean;
	users: UserResponse[];
}

class AddUser extends Component<AddUserProps, AddUserState> {
	state: AddUserState = { assignVisible: false, users: [] };

	constructor(props: AddUserProps) {
		super(props);
	}

	private onDeleteUser(user: string, name: string): void {
		if (this.props.onRemove !== undefined) this.props.onRemove(user, name);
	}

	render(): React.JSX.Element {
		return (
			<Card style={addUserStyle.card}>
				<Card.Content style={addUserStyle.cardContent}>
					<Text variant={'titleSmall'} style={{ color: getCurrentTheme().colors.onSurface }}>
						{this.props.type}
					</Text>
					<View style={addUserStyle.users}>
						{this.props.users?.map((user: UserResponse, key: number) => {
							return (
								<UserAvatar
									id={user.id}
									team={user.team ?? ''}
									key={key}
									name={user.name}
									phoneNr={user.phoneNumber}
									onDelete={
										this.props.removable && this.props.editable
											? (user: string, name: string) => {
													this.onDeleteUser(user, name);
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
								onDismiss={(user: UserResponse | undefined): void => {
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

	private addUser(user: UserResponse): void {
		let users: UserResponse[] = this.state.users.filter((value: UserResponse) => {
			return value.name === user.name && value.phoneNumber === user.phoneNumber;
		});
		if (users.length > 0) return;
		if (this.props.onAdd !== undefined) this.props.onAdd(user.id, user.name);
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
