import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface LoadingIconProps {
	visible: boolean;
}
class LoadingIcon extends Component<LoadingIconProps> {
	render() {
		return (
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					paddingHorizontal: 16,
					height: '100%',
					display: this.props.visible ? 'flex' : 'none',
					backgroundColor: undefined,
					flexDirection: 'row',
					paddingTop: 32,
					justifyContent: 'center',
					alignItems: 'flex-start'
				}}
			>
				<View style={{ backgroundColor: getCurrentTheme().colors.onSurface, borderRadius: 100, padding: 7 }}>
					<ActivityIndicator size={28} color={getCurrentTheme().colors.background} />
				</View>
			</View>
		);
	}
}

export default LoadingIcon;
