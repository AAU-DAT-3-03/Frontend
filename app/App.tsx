import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer, NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Home from './src/screens/home/Home';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, PaperProvider } from 'react-native-paper';
import History from './src/screens/history/History';
import Companies from './src/screens/Services/Companies';
import LocalStorage from './src/utility/LocalStorage';
import Login from './src/screens/login/Login';
import DataHandler from './src/utility/DataHandler';
import Logger from './src/utility/Logger';
import ButtonBarTabBar from './src/components/ButtonBarTabBar';
import { createStackNavigator } from '@react-navigation/stack';
import Incident from './src/screens/incident/Incident';
import Alarm from './src/screens/alarm/Alarm';
import CompanyServiceList from './src/screens/Services/sub_screens/CompanyServiceList';
import NotificationHandler from './src/utility/NotificationHandler';
import Toast from './src/components/Toast';
import { Notification } from 'react-native-notifications';

export interface ScreenProps {
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class NavigationBar extends Component {
	render(): React.JSX.Element {
		return (
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
						tabBarIcon: ({ color, size }: { color: string; size: number }) => {
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
						tabBarIcon: ({ color, size }: { color: string; size: number }) => {
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
						tabBarIcon: ({ color, size }: { color: string; size: number }) => {
							return <Icon source="history" size={size} color={color} />;
						}
					}}
				/>
			</Tab.Navigator>
		);
	}
}

interface AppRenderState {
	toastVisible: boolean;
	toastMessage: string;
	toastIcon: string | undefined;
	toastId: string | undefined;
}

export class AppRender extends Component {
	private static main: AppRender;
	private logger: Logger = new Logger('App');
	private loadedBaseData: boolean = false;
	public static home: Home;
	public static history: History;
	public static navigation: NavigationProp<any>;

	state: AppRenderState = {
		toastVisible: false,
		toastMessage: '',
		toastIcon: undefined,
		toastId: undefined
	};

	public static updateToast(toastMessage: string): void {
		AppRender.main.setState({
			toastMessage: toastMessage
		});
	}

	public static Toast(toastMessage: string, toastId?: string, toastIcon?: string): void {
		AppRender.main.setState({
			toastVisible: true,
			toastMessage: toastMessage,
			toastIcon: toastIcon,
			toastId: toastId
		});
	}

	constructor(props: any) {
		super(props);
		AppRender.main = this;
	}

	public static onLogOut(): void {
		AppRender.main.forceUpdate();
		AppRender.main.loadedBaseData = false;
	}

	private loadBaseData(): void {
		if (!this.loadedBaseData) {
			let notificationHandler: NotificationHandler = new NotificationHandler();
			notificationHandler.openedByNotification().then((value: Notification | undefined) => {
				if (value !== undefined) {
					this.logger.info('Opened by notification', value);
					if (value.payload.incidentId) {
						this.logger.info(`Opened with incident id: ${value.payload.incidentId}`);
						AppRender.navigation.navigate('Incident', {
							id: value.payload.incidentId
						});
					}
				}
			});

			DataHandler.getUsers();
			DataHandler.getCompanies();
			this.loadedBaseData = true;
		}
	}

	componentDidMount(): void {
		let key: string = LocalStorage.getSettingsValue('authKey');
		if (key === 'null' || key === '' || key === null) {
			return;
		}
		this.loadBaseData();
	}

	render(): React.JSX.Element {
		let key: string = LocalStorage.getSettingsValue('authKey');
		let loggedIn: boolean = true;
		if (key === 'null' || key === '' || key === null) {
			this.logger.info('User needs to log in');
			loggedIn = false;
		}
		return (
			<PaperProvider>
				{loggedIn ? (
					<NavigationContainer theme={undefined}>
						<Stack.Navigator>
							<Stack.Screen name={'main'} options={{ headerShown: false }} component={NavigationBar} />
							<Stack.Screen options={{ headerShown: false }} name="Incident">
								{(props: ScreenProps) => <Incident {...props} />}
							</Stack.Screen>
							<Stack.Screen options={{ headerShown: false }} name="Alarm">
								{(props: ScreenProps) => <Alarm {...props} />}
							</Stack.Screen>
							<Stack.Screen options={{ headerShown: false }} name="ServiceList">
								{(props: ScreenProps) => <CompanyServiceList {...props} />}
							</Stack.Screen>
						</Stack.Navigator>
						<ForegroundNotification
							onDismiss={() => this.setState({ toastVisible: false })}
							toastVisible={this.state.toastVisible}
							toastMessage={this.state.toastMessage}
							toastIcon={this.state.toastIcon}
							toastId={this.state.toastId}
						/>
					</NavigationContainer>
				) : (
					<Login
						onLoggedIn={() => {
							this.loadBaseData();
							this.forceUpdate();
						}}
					/>
				)}
			</PaperProvider>
		);
	}
}

interface ForegroundNotificationProps extends AppRenderState {
	onDismiss: () => void;
}

function ForegroundNotification(props: ForegroundNotificationProps): React.JSX.Element {
	let navigation: NavigationProp<any> = useNavigation();
	const onDismiss = (): void => {
		props.toastVisible = false;
		if (props.toastId !== undefined) {
			navigation.navigate('Incident', { id: props.toastId });
		}
		props.onDismiss();
	};
	return (
		<Toast
			message={props.toastMessage}
			visible={props.toastVisible}
			icon={props.toastIcon}
			onDismiss={() => onDismiss()}
			yOffset={100}
		/>
	);
}

function App(): React.JSX.Element {
	return <AppRender />;
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
