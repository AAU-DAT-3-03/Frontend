import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { getCurrentTheme } from '../../themes/ThemeManager';

interface UserAvatarProps {
	name: string;
}

class UserAvatar extends Component<UserAvatarProps> {
	render(): React.JSX.Element {
		return (
			<View style={userAvatarStyle.container}>
				<Icon color={userAvatarStyle.contentText.color} size={18} source={'account'} />
				<Text style={userAvatarStyle.contentText}>{this.props.name}</Text>
			</View>
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
		color: getCurrentTheme().colors.onPrimary
	}
});

export default UserAvatar;
