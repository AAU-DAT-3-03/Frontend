import React, { Component } from 'react';
import { Icon } from 'react-native-paper';
import { View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

export type IncidentState = 'none' | 'acknowledged' | 'error' | 'resolved';

interface StatusIconProps {
	status: IncidentState;
}

class StatusIcon extends Component<StatusIconProps> {
	render(): React.JSX.Element {
		let backgroundColor: string = 'transparent';
		let icon: string | undefined;

		switch (this.props.status) {
			case 'resolved': {
				backgroundColor = 'transparent';
				icon = 'check';
				break;
			}
			case 'acknowledged': {
				backgroundColor = 'transparent';
				icon = 'account-check-outline';
				break;
			}
			case 'error': {
				backgroundColor = 'transparent';
				icon = 'exclamation';
				break;
			}
		}

		return (
			<View style={{ backgroundColor: backgroundColor, aspectRatio: 1, width: 40, padding: 8, borderRadius: 100 }}>
				<Icon source={icon} color={getCurrentTheme().colors.onBackground} size={26} />
			</View>
		);
	}
}

export default StatusIcon;
