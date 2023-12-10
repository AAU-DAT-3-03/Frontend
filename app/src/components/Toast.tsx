import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, MD3Theme, Text, TouchableRipple } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';

interface ToastProps {
	message: string;
	icon?: string;
	yOffset?: number;
	visible: boolean;
	onDismiss?: () => void;
}

class Toast extends Component<ToastProps> {
	render(): React.JSX.Element {
		let stylesheet = style(getCurrentTheme(), this.props.visible, this.props.yOffset ?? 0);
		return (
			<View style={stylesheet.wrapper}>
				<TouchableRipple style={stylesheet.container} onPress={this.props.onDismiss} borderless={true}>
					<View style={stylesheet.flexContainer}>
						{this.props.icon !== undefined ? <Icon size={24} source={this.props.icon} /> : null}
						<View style={{ flexShrink: 2 }}>
							<Text variant={'bodyMedium'} adjustsFontSizeToFit={true} allowFontScaling={true} style={{ width: '100%' }}>
								{this.props.message}
							</Text>
						</View>
					</View>
				</TouchableRipple>
			</View>
		);
	}
}

export default Toast;

const style = (theme: MD3Theme, visible: boolean, yOffset: number) => {
	return StyleSheet.create({
		flexContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 16
		},
		container: {
			backgroundColor: theme.colors.background,
			padding: 16,
			borderRadius: 16
		},
		wrapper: {
			display: visible ? 'flex' : 'none',
			flexDirection: 'row',
			flexWrap: 'nowrap',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 99999999,
			width: '100%',
			padding: 16,
			position: 'absolute',
			bottom: 0 + yOffset,
			right: 0
		}
	});
};
