import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { CommonActions, NavigationContainer, NavigationProp, RouteProp } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Home from './src/screens/home/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, Icon, PaperProvider } from 'react-native-paper';
import History from './src/screens/history/History';
import Companies from './src/screens/Services/Companies';
import LocalStorage from './src/utility/LocalStorage';
import Login from './src/screens/login/Login';

export let serverIp = '';

export interface ScreenProps {
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
}

const Tab = createBottomTabNavigator();

export class AppRender extends Component {
	private static main: AppRender;

	constructor(props: any) {
		super(props);
		AppRender.main = this;
	}

	public static onLogOut(): void {
		AppRender.main.forceUpdate();
	}

	render() {
		if (LocalStorage.getSettingsValue('authKey') === 'null') {
			return <Login onLoggedIn={() => this.forceUpdate()} />;
		}
		return (
			<PaperProvider>
				<NavigationContainer theme={undefined}>
					<Tab.Navigator
						initialRouteName={'Home'}
						screenOptions={{
							headerShown: false
						}}
						tabBar={({ navigation, state, descriptors, insets }) => (
							<BottomNavigation.Bar
								navigationState={state}
								safeAreaInsets={insets}
								onTabPress={({ route, preventDefault }) => {
									const event = navigation.emit({
										type: 'tabPress',
										target: route.key,
										canPreventDefault: true
									});

									if (event.defaultPrevented) {
										preventDefault();
									} else {
										navigation.dispatch({
											...CommonActions.navigate(route.name, route.params),
											target: state.key
										});
									}
								}}
								renderIcon={({ route, focused, color }) => {
									const { options } = descriptors[route.key];
									if (options.tabBarIcon) {
										return options.tabBarIcon({ focused, color, size: 24 });
									}
									return null;
								}}
								getLabelText={({ route }) => {
									const { options } = descriptors[route.key];
									return options.tabBarLabel?.toString();
								}}
							/>
						)}
					>
						<Tab.Screen
							name="Overview"
							component={Companies}
							options={{
								headerShown: false,
								tabBarLabel: 'Overview',
								tabBarIcon: ({ color, size }) => {
									return <Icon source="view-list" size={size} color={color} />;
								}
							}}
						/>
						<Tab.Screen
							name="Home"
							component={Home}
							options={{
								headerShown: false,
								tabBarLabel: 'Home',
								tabBarIcon: ({ color, size }) => {
									return <Icon source="home" size={size} color={color} />;
								}
							}}
						/>
						<Tab.Screen
							name="History"
							component={History}
							options={{
								headerShown: false,
								tabBarLabel: 'History',
								tabBarIcon: ({ color, size }) => {
									return <Icon source="history" size={size} color={color} />;
								}
							}}
						/>
					</Tab.Navigator>
				</NavigationContainer>
			</PaperProvider>
		);
	}
}

function App(): React.JSX.Element {
	return <AppRender />;
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
