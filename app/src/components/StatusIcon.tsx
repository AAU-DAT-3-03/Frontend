import React, { Component } from 'react';
import { Icon, MD3Theme } from 'react-native-paper';
import { View } from 'react-native';
import { Colors, getCurrentTheme } from '../themes/ThemeManager';

export type IncidentState = 'acknowledged' | 'error' | 'resolved' | 'none';

interface StatusIconProps {
	status: IncidentState;
}

class StatusIcon extends Component<StatusIconProps> {
	render(): React.JSX.Element {
		let theme: MD3Theme = getCurrentTheme();
		let backgroundColor: string = 'transparent';
		let icon: string | undefined;

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
			<View style={{ backgroundColor: backgroundColor, aspectRatio: 1, width: 40, padding: 8, borderRadius: 100 }}>
				<Icon source={icon} color={'white'} size={24} />
			</View>
		);
	}
}

export default StatusIcon;
