import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer, NavigationProp, RouteProp } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Home from './src/screens/home/Home';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, PaperProvider } from 'react-native-paper';
import History from './src/screens/history/History';
import Companies from './src/screens/Services/Companies';
import LocalStorage from './src/utility/LocalStorage';
import Login from './src/screens/login/Login';
import { MockDataGenerator } from './src/utility/MockDataGenerator';
import ButtonBarTabBar from './src/components/ButtonBarTabBar';

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

	/**
	 * @todo delete this
	 */
	componentDidMount() {
		MockDataGenerator.generateIncidentList(4);
		MockDataGenerator.generateIncidentList(2, true);
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
						tabBar={({ navigation, state, descriptors, insets }: BottomTabBarProps) => (
							<ButtonBarTabBar navigation={navigation} state={state} descriptors={descriptors} insets={insets} />
						)}
					>
						<Tab.Screen
							name="Overview"
							component={Companies}
							options={{
								headerShown: false,
								tabBarLabel: 'Companies',
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
								tabBarLabel: 'Incidents',
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
