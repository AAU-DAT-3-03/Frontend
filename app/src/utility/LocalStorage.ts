import { MMKVInstance, MMKVLoader } from 'react-native-mmkv-storage';

class LocalStorage {
	static settings: MMKVInstance = new MMKVLoader().withEncryption().withInstanceID('settings').initialize();

	/**
	 * Get value from key from settings map
	 * @param {string} key - Key to retrieve value from
	 */
	public static getSettingsValue(key: string): string {
		return this.settings.getString(key);
	}

	/**
	 * Sets key-value pair in settings
	 * @param {string} key - Key to set
	 * @param {string} value - value to set
	 */
	public static setSettingsValue(key: string, value: string): boolean {
		return this.settings.setString(key, value);
	}
}

export default LocalStorage;
