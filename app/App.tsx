import React, { Component } from 'react';
import { AppRegistry, ColorSchemeName, PermissionsAndroid, useColorScheme } from 'react-native';
import BottomNavigationBar from './src/components/BottomNavigation';
import { DarkTheme } from './src/themes/DarkTheme';
import { LightTheme } from './src/themes/LightTheme';
import { PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import { Notification, NotificationCompletion, Notifications } from 'react-native-notifications';
import Networking from './src/utility/Networking';

interface AppComponentProps {
	paperTheme: ThemeProp;
}

class AppComponent extends Component<AppComponentProps> {
	constructor(props: any) {
		super(props);
		PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(() => {
			Notifications.registerRemoteNotifications();

			// Register itself to Firebase
			Notifications.events().registerRemoteNotificationsRegistered((event) => {
				// Send device token from Firebase to local server
				let network = new Networking();
				network.setHeader('Content-Type', 'application/json');
				network.post('http://10.0.2.2:8888', { body: { key: event.deviceToken } }, (value) => {
					console.log('Token register to local server: ', value);
				});
			});

			// When a foreground push notification is received this is triggered
			Notifications.events().registerNotificationReceivedForeground(
				(notification: Notification, completion: (response: NotificationCompletion) => void) => {
					console.log('Notification Received - Foreground', notification.payload);
					// Show the notification to the user
					Notifications.postLocalNotification({
						payload: notification.payload,
						identifier: 'alarm',
						title: 'Alarm',
						body: 'Alarm test',
						sound: '',
						badge: 0,
						type: '',
						thread: ''
					});
					// Complete the notification
					completion({ alert: true, sound: false, badge: false });
				}
			);
		});
	}

	render() {
		return (
			<PaperProvider theme={this.props.paperTheme}>
				<BottomNavigationBar />
			</PaperProvider>
		);
	}
}

/**
 * React-native requires a hook style component as it's main component
 * @constructor
 */
function App() {
	const colorScheme: ColorSchemeName = useColorScheme();
	const paperTheme: ThemeProp = colorScheme === 'dark' ? DarkTheme : LightTheme;
	return <AppComponent paperTheme={paperTheme} />;
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
