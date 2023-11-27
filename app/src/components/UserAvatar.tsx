import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import { Icon, IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { User } from './AddUser';

interface UserAvatarProps {
	team: string;
	name: string;
	phoneNr: number;
	onDelete?: (user: User) => void;
}

interface UserAvatarConfirmProps {
	onConfirm: () => void;
	onDismiss: () => void;
	visible: boolean;
	user: string;
}

class UserAvatarConfirm extends Component<UserAvatarConfirmProps> {
	render() {
		let buttonStyle = {
			...styles.resolveButton,
			backgroundColor: getCurrentTheme().colors.onPrimary
		};
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					<View style={styles.view}>
						<View style={styles.buttonview}>
							<IconButton
								icon="close-thick"
								iconColor={getCurrentTheme().colors.onBackground}
								size={20}
								onPress={() => this.props.onDismiss()}
							/>
						</View>
						<Text style={styles.fabtext}>Are you sure you want to remove {this.props.user}? </Text>

						<View>
							<TouchableRipple
								style={{ borderRadius: buttonStyle.borderRadius }}
								onPress={() => {
									this.props.onConfirm();
								}}
								borderless={true}
							>
								<View style={buttonStyle}>
									<Text style={styles.text} variant={'bodyLarge'}>
										Confirm
									</Text>
								</View>
							</TouchableRipple>
						</View>
					</View>
				</Modal>
			</Portal>
		);
	}
}

class UserAvatar extends Component<UserAvatarProps> {
	state = {
		confirmVisible: false
	};

	render(): React.JSX.Element {
		let onDelete = () => {
			if (this.props.onDelete !== undefined) {
				this.props.onDelete({
					team: this.props.team,
					name: this.props.name,
					phoneNr: this.props.phoneNr
				});
			}
		};
		return (
			<View>
				<UserAvatarConfirm
					user={this.props.name}
					onConfirm={() => {
						this.setState({ confirmVisible: false });
						onDelete();
					}}
					onDismiss={() => this.setState({ confirmVisible: false })}
					visible={this.state.confirmVisible}
				/>
				<TouchableRipple
					style={{ borderRadius: userAvatarStyle.container.borderRadius }}
					onPress={() => this.setState({ confirmVisible: true })}
					borderless={true}
					disabled={this.props.onDelete === undefined}
				>
					<View style={userAvatarStyle.container}>
						<Icon color={userAvatarStyle.contentText.color} size={18} source={'account'} />
						<Text style={userAvatarStyle.contentText}>{this.props.name}</Text>
					</View>
				</TouchableRipple>
				{this.props.onDelete === undefined ? null : (
					<TouchableRipple
						style={userAvatarStyle.badge}
						onPress={() => this.setState({ confirmVisible: true })}
						borderless={true}
					>
						<Text variant={'labelSmall'} style={userAvatarStyle.badgeText}>
							–
						</Text>
					</TouchableRipple>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: getCurrentTheme().colors.tertiary,
		borderRadius: 40,
		width: '50%'
	},
	fabtext: {
		paddingBottom: 10,
		textAlign: 'center'
	},
	view: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 16,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'column',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		width: 230,
		height: 153
	},
	buttonview: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: '100%'
	},
	text: {
		verticalAlign: 'middle'
	},
	resolveButton: {
		alignItems: 'center',
		height: 48,
		flexDirection: 'row',
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 20,

		gap: 16
	}
});

const userAvatarStyle = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingRight: 8,
		paddingLeft: 6,
		paddingVertical: 4,
		borderRadius: 16,
		backgroundColor: getCurrentTheme().colors.primary
	},
	contentText: {
		color: 'white',
		verticalAlign: 'middle'
	},
	badge: {
		position: 'absolute',
		borderRadius: 16,
		padding: 0,
		margin: 0,
		top: -4,
		right: 0
	},
	badgeText: {
		backgroundColor: getCurrentTheme().colors.error,
		color: 'white',
		height: '100%',
		borderRadius: 16,
		verticalAlign: 'middle',
		lineHeight: 5,
		padding: 8,
		paddingHorizontal: 2,
		paddingBottom: 0,
		margin: 0,
		marginBottom: -2
	}
});

export default UserAvatar;
