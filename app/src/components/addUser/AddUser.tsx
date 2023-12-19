// Importing libraries and components.
import React, { Component } from 'react';
import { Card, IconButton, Text } from 'react-native-paper';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { StyleSheet, View } from 'react-native';
import UserAvatar from '../UserAvatar';
import { UserResponse } from '../../utility/DataHandlerTypes';
import AssignUser from './AssignUser';

/**
 * @brief Defines the arbitrary inputs (props) for the AddUser component.
 */
interface AddUserProps {
	type: string;
	usersAll: UserResponse[];
	users: UserResponse[];
	removable: boolean;
	onRemove?: (user: string, name: string) => void;
	onAdd?: (user: string, name: string) => void;
	editable: boolean;
}
/**
 * @brief Defines the state for the AddUser component.
 */
interface AddUserState {
	assignVisible: boolean;
	users: UserResponse[];
}
/**
 * @brief A class component that allows adding and removing users.
 * @details This component displays a list of users and allows adding and removing users if editable. It also provides a modal to assign users.
 */
class AddUser extends Component<AddUserProps, AddUserState> {
	state: AddUserState = { assignVisible: false, users: this.props.users };

	/**
	 * @brief Deletes a user from the state and calls the onRemove prop if defined.
	 * @param {String} user - The user to be deleted.
	 */
	private onDeleteUser(user: UserResponse): void {
		this.setState({ users: this.state.users.filter((value: UserResponse): boolean => value.id !== user.id) });
		if (this.props.onRemove !== undefined) this.props.onRemove(user.id, user.name);
	}
	/**
	 * @brief Renders the component.
	 * @return {React.JSX.Element} - The rendered AddUser component.
	 */
	render(): React.JSX.Element {
		return (
			<Card style={addUserStyle.card}>
				<Card.Content style={addUserStyle.cardContent}>
					<Text variant={'titleSmall'} style={{ color: getCurrentTheme().colors.onSurface }}>
						{this.props.type}
					</Text>
					<View style={addUserStyle.users}>
						{this.state.users?.map((user: UserResponse, key: number) => {
							return (
								<UserAvatar
									key={key}
									user={user}
									onDelete={
										this.props.removable && this.props.editable
											? (deletedUser: UserResponse): void => {
													this.onDeleteUser(deletedUser);
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
								visible={this.state.assignVisible}
								onDismiss={(user: UserResponse | undefined): void => {
									if (user !== undefined) this.addUser(user);
									this.setState({ assignVisible: false });
								}}
								users={this.props.usersAll.filter((user) => {
									return this.state.users.filter((value) => value.id === user.id).length === 0;
								})}
							/>
						</>
					) : null}
				</Card.Content>
			</Card>
		);
	}

	/**
	 * @brief Adds a user to the state and calls the onAdd prop if defined.
	 * @param {String} user - The user to be added.
	 */
	private addUser(user: UserResponse): void {
		let users: UserResponse[] = this.state.users.filter((value: UserResponse) => {
			return value.name === user.name && value.phoneNumber === user.phoneNumber;
		});
		if (users.length > 0) return;
		if (this.props.onAdd !== undefined) {
			this.setState({ users: [...this.state.users, user] });
			this.props.onAdd(user.id, user.name);
		}
	}
}

/**
 * @brief Styles for the AddUser component.
 */
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
		maxWidth: '100%',
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		backgroundColor: getCurrentTheme().colors.elevation.level4
	}
});
export default AddUser;
