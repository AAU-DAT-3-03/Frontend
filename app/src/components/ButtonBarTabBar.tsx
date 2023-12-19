import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabDescriptor } from '@react-navigation/bottom-tabs/lib/typescript/src/types';

/**
 * The bottom bar render for the navigation stack to render using Paper component instead
 */
class ButtonBarTabBar extends Component<BottomTabBarProps, any> {
	render(): React.JSX.Element {
		return (
			<BottomNavigation.Bar
				navigationState={this.props.state}
				safeAreaInsets={this.props.insets}
				onTabPress={({ route, preventDefault }): void => {
					// Create the event when a tab button has been pressed
					const event = this.props.navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true
					});

					// Check it has not been prevented by listener
					if (event.defaultPrevented) {
						preventDefault();
					} else {
						// Trigger the navigation to switch screen
						this.props.navigation.dispatch({
							...CommonActions.navigate(route.name, route.params),
							target: this.props.state.key
						});
					}
				}}
				renderIcon={({ route, focused, color }) => {
					// Set the render icon if it exists
					const { options }: BottomTabDescriptor = this.props.descriptors[route.key];
					if (options.tabBarIcon) {
						return options.tabBarIcon({ focused, color, size: 24 });
					}
					return null;
				}}
				getLabelText={({ route }) => {
					// Set the render text if it exists
					const { options }: BottomTabDescriptor = this.props.descriptors[route.key];
					return options.tabBarLabel?.toString();
				}}
			/>
		);
	}
}

export default ButtonBarTabBar;
