import { Permission, PermissionsAndroid, PermissionStatus } from 'react-native';
import LocalStorage from './LocalStorage';
import {
	Notification,
	NotificationBackgroundFetchResult,
	NotificationCompletion,
	Notifications,
	Registered
} from 'react-native-notifications';
import DataHandler from './DataHandler';
import { AppRender } from '../../App';
import Logger from './Logger';

class NotificationHandler {
	// Is device registered with Google Firebase
	static registered: boolean = false;
	private logger: Logger = new Logger('NotificationHandler');

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
		if (!allowNotifications) return this.logger.warn("User doesn't allow notifications, bye!");
		await this.registerRemote();
		this.handleForegroundNotifications();
		this.handleBackgroundNotifications();
	}

	/**
	 * Asks for permissions from the user, if already given returns true
	 * @param {Permission} permission - Which permission to ask for
	 */
	private async getPermissionsAndroid(permission: Permission): Promise<PermissionStatus> {
		// Request permission from the user
		return await PermissionsAndroid.request(permission);
	}

	/**
	 * Get permission for push notifications from user
	 */
	private async getPushNotificationPermissionsAndroid(): Promise<Boolean> {
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
	private async registerRemote(): Promise<unknown> {
		if (NotificationHandler.registered) return true;

		// Register itself to Firebase
		Notifications.registerRemoteNotifications();

		return await new Promise((resolve) => {
			// Start listening for response from registration
			Notifications.events().registerRemoteNotificationsRegistered((event: Registered): void => {
				// Ensure token is given
				if (event.deviceToken === undefined || event.deviceToken.length === 0) return;

				DataHandler.registerNotification(event.deviceToken);
				resolve(true);
			});
		});
	}

	/**
	 * Handles when a notification is received in the foreground
	 */
	private handleForegroundNotifications(): void {
		Notifications.events().registerNotificationReceivedForeground(
			(notification: Notification, completion: (response: NotificationCompletion) => void) => {
				this.logger.info('Notification Received - Foreground', notification.payload);
				AppRender.Toast(notification.body, notification.payload.incindentId ?? undefined, 'exclamation');
				completion({ alert: true, sound: true, badge: true });
			}
		);
		this.logger.info('Foreground notification registered');
	}

	/**
	 * Handles when a notification is received in the background
	 */
	private handleBackgroundNotifications(): void {
		Notifications.events().registerNotificationReceivedBackground(
			(notification: Notification, completion: (response: NotificationBackgroundFetchResult) => void) => {
				this.logger.info(notification.payload.toString());
				completion(NotificationBackgroundFetchResult.NEW_DATA);
			}
		);
		this.logger.info('Background notification registered');
	}

	/**
	 * Returns a notification if the app was launched by a notification
	 * @public
	 * @return {Notification | undefined}
	 */
	public async openedByNotification(): Promise<Notification | undefined> {
		let notification: Notification | undefined = await Notifications.getInitialNotification();
		return notification;
	}
}

export default NotificationHandler;
