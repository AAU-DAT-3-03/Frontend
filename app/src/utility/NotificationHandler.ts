import { Permission, PermissionsAndroid, PermissionStatus } from 'react-native';
import LocalStorage from './LocalStorage';
import { Notification, NotificationCompletion, Notifications, Registered } from 'react-native-notifications';
import Networking from './Networking';

/**
 * Temp success message
 * @todo Integrate with actual server
 */
type RegisterSuccess = {
	success: boolean;
};

class NotificationHandler {
	static registered: boolean = false;

	constructor() {
		this.init();
	}

	private async init() {
		await this.registerRemote();
		await this.getPushNotificationPermissionsAndroid();
		this.handleForegroundNotifications();
		this.handleBackgroundNotifications();
	}

	public async getPermissionsAndroid(permission: Permission): Promise<PermissionStatus> {
		// No need to ask permission if it's already given
		if (await PermissionsAndroid.check(permission)) return 'granted';

		// Request permission from the user
		return await PermissionsAndroid.request(permission);
	}

	public async getPushNotificationPermissionsAndroid(): Promise<Boolean> {
		// Check local storage, if it's been permanently denied
		if (LocalStorage.getSettingsValue('notification_never_ask_again') === 'true') return false;

		// Get status from permissions or user
		let status: PermissionStatus = await this.getPermissionsAndroid(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		if (status === 'granted') return true;

		// Save never ask again into settings to avoid asking again
		if (status === 'never_ask_again') LocalStorage.setSettingsValue('notification_never_ask_again', 'true');

		return false;
	}

	public async registerRemote(): Promise<Boolean> {
		if (NotificationHandler.registered) return true;

		Notifications.registerRemoteNotifications();

		// Register itself to Firebase
		return new Promise(() => {
			Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
				if (event.deviceToken === undefined || event.deviceToken.length === 0) return false;
				// Send device token from Firebase to local server
				let network: Networking = new Networking();
				network.setHeader('Content-Type', 'application/json');
				network.post('http://10.0.2.2:8888', { body: { key: event.deviceToken } }, (value: Object) => {
					let success: RegisterSuccess = JSON.parse(JSON.stringify(value));
					console.log('Token register to local server: ', success.success);
					NotificationHandler.registered = success.success;
					return success.success;
				});
			});
		});
	}

	public handleForegroundNotifications(): void {
		Notifications.events().registerNotificationReceivedForeground(
			(notification: Notification, completion: (response: NotificationCompletion) => void) => {
				console.log('Notification Received - Foreground', notification.payload);
				this.handleNotifications(notification, completion);
			}
		);
	}

	public handleBackgroundNotifications(): void {
		Notifications.events().registerNotificationReceivedBackground((notification) => {
			console.log(notification.payload);
			this.handleNotifications(notification);
		});
	}

	private handleAlarm(notification: Notification) {
		// Show the notification to the user
		Notifications.postLocalNotification({
			payload: notification.payload,
			identifier: 'alarm',
			title: notification.payload.title,
			body: notification.payload.body,
			sound: '',
			badge: 0,
			type: '',
			thread: ''
		});
	}

	private handleNotifications(notification: Notification, completion?: any): void {
		if (notification.payload.hasOwnProperty('type') && typeof notification.payload.type === 'string') {
			switch (notification.payload.type) {
				case 'alarm': {
					this.handleAlarm(notification);
				}
			}
		}

		// Complete the notification
		if (completion !== undefined) completion({ alert: true, sound: false, badge: false });
	}
}

export default NotificationHandler;
