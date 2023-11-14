import React, { Component } from 'react';
import { Icon, MD3Theme } from 'react-native-paper';
import { View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import { Colors } from '../themes/DarkTheme';

export type IncidentState = 'acknowledged' | 'error' | 'resolved' | 'none';

interface StatusIconProps {
	status: IncidentState;
}

class StatusIcon extends Component<StatusIconProps> {
	render(): React.JSX.Element {
		let theme: MD3Theme = getCurrentTheme();
		let backgroundColor: string = 'transparent';
		let icon: string | undefined = undefined;

		switch (this.props.status) {
			case 'resolved': {
				backgroundColor = theme.colors.tertiary;
				icon = 'check';
				break;
			}
			case 'acknowledged': {
				backgroundColor = Colors.warn;
				icon = 'account-check-outline';
				break;
			}
			case 'error': {
				backgroundColor = theme.colors.error;
				icon = 'exclamation';
				break;
			}
		}

		return (
			<View style={{ backgroundColor: backgroundColor, aspectRatio: 1, width: 33, padding: 4, borderRadius: 100 }}>
				<Icon source={icon} color={'white'} size={25} />
			</View>
		);
	}
}

export default StatusIcon;
