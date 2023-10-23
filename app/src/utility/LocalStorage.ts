import { MMKVLoader } from 'react-native-mmkv-storage';

class LocalStorage {
	static settings = new MMKVLoader().withEncryption().withInstanceID('settings').initialize();

	public static getSettingsValue(key: string): string {
		return this.settings.getString(key);
	}

	public static setSettingsValue(key: string, value: string): boolean {
		return this.settings.setString(key, value);
	}
}

export default LocalStorage;
