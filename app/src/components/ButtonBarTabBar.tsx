import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

class ButtonBarTabBar extends Component<BottomTabBarProps, any> {
	render(): React.JSX.Element {
		return (
			<BottomNavigation.Bar
				navigationState={this.props.state}
				safeAreaInsets={this.props.insets}
				onTabPress={({ route, preventDefault }) => {
					const event = this.props.navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true
					});

					if (event.defaultPrevented) {
						preventDefault();
					} else {
						this.props.navigation.dispatch({
							...CommonActions.navigate(route.name, route.params),
							target: this.props.state.key
						});
					}
				}}
				renderIcon={({ route, focused, color }) => {
					const { options } = this.props.descriptors[route.key];
					if (options.tabBarIcon) {
						return options.tabBarIcon({ focused, color, size: 24 });
					}
					return null;
				}}
				getLabelText={({ route }) => {
					const { options } = this.props.descriptors[route.key];
					return options.tabBarLabel?.toString();
				}}
			/>
		);
	}
}

export default ButtonBarTabBar;
