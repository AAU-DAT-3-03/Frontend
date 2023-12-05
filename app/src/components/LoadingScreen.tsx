import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleProp, View, ViewStyle } from 'react-native';
import Color from 'color';
import { getCurrentTheme } from '../themes/ThemeManager';

class LoadingScreen extends Component {
	render(): React.JSX.Element {
		let style: StyleProp<ViewStyle> = {
			height: Dimensions.get('window').height - 200,
			width: Dimensions.get('window').width,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		};
		return (
			<View style={style}>
				<ActivityIndicator size={64} color={Color(getCurrentTheme().colors.onSurface).alpha(0.5).toString()} />
			</View>
		);
	}
}

export default LoadingScreen;
