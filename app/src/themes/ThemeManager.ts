import { Appearance } from 'react-native';
import { DarkTheme } from './DarkTheme';
import { LightTheme } from './LightTheme';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const Colors = {
	error: '#AA1E2E',
	warn: '#E1B000',
	allGood: '#44BE50'
};
/**
 * Gets the current theme. Light or dark depending on the system setting
 * @return {ThemeProp} - the current theme
 */
export function getCurrentTheme(): ThemeProp {
	return Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme;
}
