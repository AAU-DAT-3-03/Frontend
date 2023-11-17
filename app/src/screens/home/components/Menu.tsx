import React, { Component } from 'react';
import { Button, Drawer, IconButton, Modal, Portal, Switch, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Colors, getCurrentTheme } from '../../../themes/ThemeManager';
import LocalStorage from '../../../utility/LocalStorage';

interface MenuProps {
	visible: boolean;
	onDismiss: () => void;
	onLogOut: () => void;
}

class Menu extends Component<MenuProps> {
	state = {
		notification: false
	};

	constructor(props: MenuProps) {
		super(props);
		if (LocalStorage.getSettingsValue('notification') === 'null') LocalStorage.setSettingsValue('notification', 'true');
		this.state.notification = LocalStorage.getSettingsValue('notification') === 'true' ? true : false;
	}

	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={MenuStyle().modal} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					<View style={MenuStyle().container}>
						<View style={MenuStyle().close}>
							<IconButton icon={'close'} onPress={() => this.props.onDismiss()} />
						</View>
						<View style={MenuStyle().content}>
							<Drawer.Section style={{ width: '100%' }} showDivider={true}>
								<View style={MenuStyle().row}>
									<Text>Notifications</Text>
									<Switch
										value={this.state.notification}
										onValueChange={(value: boolean): void => {
											LocalStorage.setSettingsValue('notification', value ? 'true' : 'false');
											this.setState({ notification: value });
										}}
									/>
								</View>
							</Drawer.Section>
						</View>
						<View style={MenuStyle().logOut}>
							<Button
								buttonColor={Colors.error}
								textColor={'white'}
								onPress={() => {
									LocalStorage.setSettingsValue('authKey', 'null');
									this.props.onLogOut();
								}}
							>
								Log out
							</Button>
						</View>
					</View>
				</Modal>
			</Portal>
		);
	}
}

const MenuStyle = () => {
	return StyleSheet.create({
		modal: {
			width: '45%',
			height: '100%',
			left: 0,
			top: 0
		},
		container: {
			backgroundColor: getCurrentTheme().colors.surface,
			height: '100%',
			flexDirection: 'column',
			alignItems: 'flex-start'
		},
		row: {
			width: '100%',
			paddingHorizontal: 16,
			gap: 16,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignSelf: 'flex-start',
			alignItems: 'center'
		},
		content: {
			flexDirection: 'row',
			flexGrow: 2
		},
		close: {
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'flex-end'
		},
		logOut: {
			width: '100%',
			padding: 16
		}
	});
};

export default Menu;
