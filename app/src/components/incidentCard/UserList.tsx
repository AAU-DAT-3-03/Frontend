import { UserResponse } from '../../utility/DataHandlerTypes';
import React, { Component } from 'react';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { MD3Theme, Modal, Portal } from 'react-native-paper';
import UserInformation from '../UserInformation';
import { StyleSheet, View } from 'react-native';
import UserAvatar from './UserAvatar';

interface UserListProps {
	users?: UserResponse[];
	visible: boolean;
	onDismiss: () => void;
}

interface UserListState {
	userInfoVisible: boolean;
	selectedUser: UserResponse | undefined;
}

/**
 * A modal of all user for an incident
 */
class UserList extends Component<UserListProps, UserListState> {
	state: UserListState = {
		userInfoVisible: false,
		selectedUser: undefined
	};

	render(): React.JSX.Element {
		let style = UserListStyle(getCurrentTheme());
		return (
			<Portal>
				<Modal style={style.modal} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					{this.getUserInformationRender()}
					<View style={style.listContainer}>
						{this.props.users?.map((value: UserResponse, key: number) => {
							return (
								<UserAvatar
									key={key}
									name={value.name}
									onPress={(): void => {
										this.setState({ userInfoVisible: true, selectedUser: value });
									}}
								/>
							);
						})}
					</View>
				</Modal>
			</Portal>
		);
	}

	/**
	 * Returns the UserInformation component if it's visible and selectedUsers are not undefined
	 */
	private getUserInformationRender(): React.JSX.Element | null {
		if (!this.state.userInfoVisible || this.state.selectedUser === undefined) return null;
		return (
			<UserInformation
				user={this.state.selectedUser}
				visible={this.state.userInfoVisible}
				onDismiss={() => this.setState({ userInfoVisible: false })}
			/>
		);
	}
}

const UserListStyle = (theme: MD3Theme) => {
	return StyleSheet.create({
		listContainer: {
			maxWidth: '90%',
			backgroundColor: theme.colors.surface,
			borderRadius: 20,
			padding: 16,
			gap: 16
		},
		modal: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: undefined,
			position: 'absolute'
		}
	});
};

export default UserList;
