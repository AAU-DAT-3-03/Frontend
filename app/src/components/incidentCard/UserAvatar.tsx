import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { getCurrentTheme } from '../../themes/ThemeManager';

interface UserAvatarProps {
	name: string;
	onPress?: () => void;
}

class UserAvatar extends Component<UserAvatarProps> {
	render(): React.JSX.Element {
		// @ts-ignore
		let onPress = this.props.onPress !== undefined ? () => this.props.onPress() : undefined;
		return (
			<TouchableRipple style={{ borderRadius: userAvatarStyle.container.borderRadius }} onPress={onPress} borderless={true}>
				<View style={userAvatarStyle.container}>
					<Icon color={userAvatarStyle.contentText.color} size={18} source={'account'} />
					<Text style={userAvatarStyle.contentText}>{this.props.name}</Text>
				</View>
			</TouchableRipple>
		);
	}
}

const userAvatarStyle = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		gap: 2,
		paddingRight: 10,
		paddingLeft: 8,
		paddingVertical: 4,
		borderRadius: 16,
		backgroundColor: getCurrentTheme().colors.primary,
		height: 28
	},
	contentText: {
		color: getCurrentTheme().colors.primaryContainer
	}
});

export default UserAvatar;
