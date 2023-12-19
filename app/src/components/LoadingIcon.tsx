import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface LoadingIconProps {
	visible: boolean;
	verticalOffset?: number;
}

/**
 * Loading Icon component used, for example, when updating incidents on home screen
 */
class LoadingIcon extends Component<LoadingIconProps> {
	render() {
		return (
			<View
				style={{
					display: this.props.visible ? 'flex' : 'none',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 100,
					width: '100%',
					padding: 16,
					position: 'absolute',
					top: 0 + (this.props.verticalOffset ?? 0),
					right: 0
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
