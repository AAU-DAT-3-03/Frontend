import { Appearance } from 'react-native';
import { DarkTheme } from '../themes/DarkTheme';
import { LightTheme } from '../themes/LightTheme';
import { MD3Theme } from 'react-native-paper';

/**
 * Gets the current theme. Light or dark depending on the system setting
 * @return {ThemeProp} - the current theme
 */
export function getCurrentTheme(): MD3Theme {
	return Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme;
}
