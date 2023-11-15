import { Appearance } from 'react-native';
import { DarkTheme } from '../themes/DarkTheme';
import { LightTheme } from '../themes/LightTheme';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

/**
 * Gets the current theme. Light or dark depending on the system setting
 * @return {ThemeProp} - the current theme
 */
export function getCurrentTheme(): ThemeProp {
	return Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme;
}
