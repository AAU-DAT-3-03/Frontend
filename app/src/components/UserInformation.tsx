import React, { Component } from 'react';
import { Button, Icon, MD3Theme, Modal, Portal, Text } from 'react-native-paper';
import { Linking, StyleSheet, View } from 'react-native';
import { UserResponse } from '../utility/DataHandlerTypes';
import { Colors, getCurrentTheme } from '../themes/ThemeManager';
import { UserAvatarConfirm } from './UserAvatar';

interface UserInformationProp {
	user: UserResponse;
	visible: boolean;
	onDismiss: () => void;
	onRemove?: (id: string) => void;
}
/**
 * class for Popup of information on a specific User
 */
class UserInformation extends Component<UserInformationProp> {
	state = {
		confirmVisible: false
	};
	render() {
		let style = UserListStyle(getCurrentTheme());

		return (
			<Portal>
				<Modal visible={this.props.visible} onDismiss={() => this.props.onDismiss()} style={style.modal}>
					<View style={style.listContainer}>
						<Text variant={'titleMedium'}>{this.props.user.name}</Text>
						{/* Display Team to the user*/}
						<View style={style.row}>
							<Icon size={24} source={'account-group'} />
							<Button
								contentStyle={style.buttonStyle}
								style={style.buttonStyle}
								textColor={getCurrentTheme().colors.onSurface}
							>
								{this.props.user.team}
							</Button>
						</View>
						{/* Display User phone number*/}
						<View style={style.row}>
							<Icon size={24} source={'phone'} />
							<Button
								contentStyle={style.buttonStyle}
								style={style.buttonStyle}
								onPress={() => Linking.openURL(`tel:${this.props.user.phoneNumber}`)}
							>
								{this.props.user.phoneNumber}
							</Button>
						</View>
						{/* Display User email*/}
						<View style={style.row}>
							<Icon size={24} source={'email'} />
							<Button
								contentStyle={style.buttonStyle}
								style={style.buttonStyle}
								onPress={() => Linking.openURL(`mailto:${this.props.user.email}`)}
							>
								{this.props.user.email}
							</Button>
						</View>
						{/* If removable, display button to remove, else nothing*/}
						{this.props.onRemove !== undefined ? (
							<View>
								<Button
									buttonColor={Colors.error}
									textColor={'white'}
									onPress={() => {
										this.setState({ confirmVisible: true });
									}}
								>
									Remove user
								</Button>
								{/*Popup to remove the user */} 
								<UserAvatarConfirm
									user={this.props.user.name}
									onConfirm={() => {
										this.setState({ confirmVisible: false });
										if (this.props.onRemove !== undefined) this.props.onRemove(this.props.user.id);
									}}
									onDismiss={() => this.setState({ confirmVisible: false })}
									visible={this.state.confirmVisible}
								/>
							</View>
						) : null}
					</View>
				</Modal>
			</Portal>
		);
	}
}

const UserListStyle = (theme: MD3Theme) => {
	return StyleSheet.create({
		buttonStyle: {
			flexGrow: 2,
			textAlign: 'left',
			justifyContent: 'flex-start'
		},
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
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center',
			flexWrap: 'nowrap',
			gap: 8
		}
	});
};

export default UserInformation;
