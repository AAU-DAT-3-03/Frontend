import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import { Card, Icon, Text, TouchableRipple } from 'react-native-paper';
import Color from 'color';
import { User } from './AddUser';

interface UserAvatarProps {
	team: string;
	name: string;
	phoneNr: number;
	onDelete?: (user: User) => void;
}

class UserAvatar extends Component<UserAvatarProps> {
	render(): React.JSX.Element {
		return (
			<View style={userAvatarStyle.container}>
				<Icon color={userAvatarStyle.contentText.color} size={18} source={'account'} />
				<Text style={userAvatarStyle.contentText}>{this.props.name}</Text>
				{this.props.onDelete === undefined ? null : (
					<TouchableRipple
						style={userAvatarStyle.badge}
						onPress={() => {
							if (this.props.onDelete !== undefined)
								this.props.onDelete({
									team: this.props.team,
									name: this.props.name,
									phoneNr: this.props.phoneNr
								});
						}}
						borderless={true}
						rippleColor={Color(getCurrentTheme().colors.onError).alpha(0.3).string()}
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
		lineHeight: 4,
		padding: 8,
		paddingHorizontal: 2,
		paddingBottom: 0,
		margin: 0
	}
});

export default UserAvatar;
