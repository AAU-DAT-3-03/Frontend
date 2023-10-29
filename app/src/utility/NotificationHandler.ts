import { Permission, PermissionsAndroid, PermissionStatus } from 'react-native';
import LocalStorage from './LocalStorage';
import {
	Notification,
	NotificationBackgroundFetchResult,
	NotificationCompletion,
	Notifications,
	Registered
} from 'react-native-notifications';
import Networking from './Networking';

/**
 * Temp success message
 * @todo Integrate with actual server
 */
type RegisterSuccess = {
	success: boolean;
};

class Logger {
	private static tag(): string {
		let date: Date = new Date(Date.now());
		return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}/NotificationHandler] `;
	}

	public static info(...msg: string[]): void {
		console.log(this.tag(), msg.join(','));
	}

	public static warn(...msg: string[]): void {
		console.warn(this.tag(), msg.join(','));
	}

	public static error(...msg: string[]): void {
		console.error(this.tag(), msg.join(','));
	}
}

class NotificationHandler {
	// Is device registered with Google Firebase
	static registered: boolean = false;

	constructor() {
		this.init();
	}

	/**
	 * Initializes all required for receiving notifications
	 * @private
	 */
	private async init(): Promise<void> {
		if (NotificationHandler.registered) return;
		let allowNotifications: Boolean = await this.getPushNotificationPermissionsAndroid();
		if (!allowNotifications) return Logger.warn("User doesn't allow notifications, bye!");
		await this.registerRemote();
		this.handleForegroundNotifications();
		this.handleBackgroundNotifications();
	}

	/**
	 * Asks for permissions from the user, if already given returns true
	 * @param {Permission} permission - Which permission to ask for
	 */
	public async getPermissionsAndroid(permission: Permission): Promise<PermissionStatus> {
		// Request permission from the user
		return await PermissionsAndroid.request(permission);
	}

	/**
	 * Get permission for push notifications from user
	 */
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

	/**
	 * Register device with Google Firebase, and send id to backend
	 */
	public async registerRemote(): Promise<unknown> {
		if (NotificationHandler.registered) return true;

		// Register itself to Firebase
		Notifications.registerRemoteNotifications();

		return await new Promise((resolve) => {
			// Start listening for response from registration
			Notifications.events().registerRemoteNotificationsRegistered((event: Registered): void => {
				// Ensure token is given
				if (event.deviceToken === undefined || event.deviceToken.length === 0) return;

				let network: Networking = new Networking();
				// Set content type to JSON
				network.setHeader('Content-Type', 'application/json');

				// Send token to server
				network.post('http://10.0.2.2:8888', { body: { key: event.deviceToken } }, (value: Object) => {
					let success: RegisterSuccess = JSON.parse(JSON.stringify(value));
					Logger.info('Token register to local server: ' + success.success ? 'true' : 'false');
					NotificationHandler.registered = success.success;

					// Finish promise
					resolve(true);
				});
			});
		});
	}

	/**
	 * Handles when a notification is received in the foreground
	 */
	public handleForegroundNotifications(): void {
		Notifications.events().registerNotificationReceivedForeground(
			(notification: Notification, completion: (response: NotificationCompletion) => void) => {
				Logger.info('Notification Received - Foreground', notification.payload.toString());
				completion({ alert: true, sound: true, badge: true });
			}
		);
		Logger.info('Foreground notification registered');
	}

	/**
	 * Handles when a notification is received in the background
	 */
	public handleBackgroundNotifications(): void {
		Notifications.events().registerNotificationReceivedBackground(
			(notification: Notification, completion: (response: NotificationBackgroundFetchResult) => void) => {
				Logger.info(notification.payload.toString());
				completion(NotificationBackgroundFetchResult.NEW_DATA);
			}
		);
		Logger.info('Background notification registered');
	}

	/**
	 * Returns a notification if the app was launched by a notification
	 * @private
	 * @return {Notification | undefined}
	 */
	private async openedByNotification(): Promise<Notification | undefined> {
		let notification: Notification | undefined = await Notifications.getInitialNotification();
		return notification;
	}
}

export default NotificationHandler;
