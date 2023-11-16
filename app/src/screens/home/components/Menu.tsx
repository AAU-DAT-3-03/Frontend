import React, { Component } from 'react';
import { Button, Drawer, IconButton, Modal, Portal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Colors, getCurrentTheme } from '../../../themes/ThemeManager';

interface MenuProps {
	visible: boolean;
	onDismiss: () => void;
}

class Menu extends Component<MenuProps> {
	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={MenuStyle().modal} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					<View style={MenuStyle().container}>
						<View style={MenuStyle().close}>
							<IconButton icon={'close'} onPress={() => this.props.onDismiss()} />
						</View>
						<View style={MenuStyle().content}>
							<Button>test</Button>
						</View>
						<View style={MenuStyle().logOut}>
							<Button buttonColor={Colors.error} textColor={'white'}>
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
			width: '40%',
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
