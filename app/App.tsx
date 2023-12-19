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

/**
 * Creates the render and navigation stack for the navigation bar at the bottom of the screen.
 */
class NavigationBar extends Component {
	render(): React.JSX.Element {
		return (
			<>
				{/* The main stack navigator */}
				<Tab.Navigator
					initialRouteName={'Home'}
					screenOptions={{
						headerShown: false
					}}
					tabBar={({ navigation, state, descriptors, insets }: BottomTabBarProps) => (
						<ButtonBarTabBar navigation={navigation} state={state} descriptors={descriptors} insets={insets} />
					)}
				>
					{/* The overview route */}
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
					{/* The home route */}
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
					{/* The history route */}
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
			</>
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

	/**
	 * Creates a toast to display important messages, specifically notification
	 * @param {string} toastMessage - The message to display in the toast
	 * @param {string} toastId - The id of the incident, to be able to route on click
	 * @param {string} toastIcon - Optional icon to display
	 * @constructor
	 */
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

	/**
	 * Can be called to log out of the app
	 */
	public static onLogOut(): void {
		AppRender.main.forceUpdate();
		AppRender.main.loadedBaseData = false;
	}

	/**
	 * Loads the basic data for the application being the all the users and all the companies.
	 * Checks if the application was opened by a notification
	 */
	private loadBaseData(): void {
		// Check if the base data has already been loaded
		if (!this.loadedBaseData) {
			// Check if the application was opened by a notification
			let notificationHandler: NotificationHandler = new NotificationHandler();
			notificationHandler.openedByNotification().then((value: Notification | undefined): void => {
				// Check if a notification is available
				if (value !== undefined) {
					// Try to navigate to the incident screen if it has an incident id
					this.logger.info('Opened by notification', value);
					if (value.payload.incidentId) {
						this.logger.info(`Opened with incident id: ${value.payload.incidentId}`);
						AppRender.navigation.navigate('Incident', {
							id: value.payload.incidentId
						});
					}
				}
			});

			// Load all users and companies
			DataHandler.getUsers();
			DataHandler.getCompanies();
			this.loadedBaseData = true;
		}
	}

	/**
	 * Gets triggered when the component first gets mounted. Check if the user has an authentication screen and loads base data.
	 */
	componentDidMount(): void {
		let key: string = LocalStorage.getSettingsValue('authKey');
		if (key === 'null' || key === '' || key === null) {
			return;
		}
		this.loadBaseData();
	}

	render(): React.JSX.Element {
		// If authentication token is missing or empty send the user to the login screen
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

/**
 * Handles foreground notification, by creating a render for the toast.
 * @param {ForegroundNotificationProps} props - the props for the foreground notification handler, includes the onDismiss
 * @constructor
 */
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
