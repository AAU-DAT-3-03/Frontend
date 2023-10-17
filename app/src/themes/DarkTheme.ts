import { MD3DarkTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper/src/types';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const DarkTheme: ThemeProp = {
	...MD3DarkTheme,
	colors: {
		primary: 'rgb(93, 212, 252)',
		onPrimary: 'rgb(23,47,58)',
		primaryContainer: 'rgb(0, 77, 97)',
		onPrimaryContainer: 'rgb(184, 234, 255)',
		secondary: 'rgb(255, 179, 178)',
		onSecondary: 'rgb(104, 0, 19)',
		secondaryContainer: 'rgb(146, 0, 31)',
		onSecondaryContainer: 'rgb(255, 218, 217)',
		tertiary: 'rgb(121, 209, 255)',
		onTertiary: 'rgb(0, 53, 73)',
		tertiaryContainer: 'rgb(0, 76, 104)',
		onTertiaryContainer: 'rgb(195, 232, 255)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(25, 28, 29)',
		onBackground: 'rgb(225, 227, 228)',
		surface: 'rgb(25, 28, 29)',
		onSurface: 'rgb(225, 227, 228)',
		surfaceVariant: 'rgb(64, 72, 76)',
		onSurfaceVariant: 'rgb(191, 200, 204)',
		outline: 'rgb(138, 146, 150)',
		outlineVariant: 'rgb(64, 72, 76)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(225, 227, 228)',
		inverseOnSurface: 'rgb(46, 49, 50)',
		inversePrimary: 'rgb(0, 103, 128)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(28, 37, 40)',
			level2: 'rgb(30, 43, 47)',
			level3: 'rgb(33, 48, 54)',
			level4: 'rgb(33, 50, 56)',
			level5: 'rgb(35, 54, 60)'
		},
		surfaceDisabled: 'rgba(225, 227, 228, 0.12)',
		onSurfaceDisabled: 'rgba(225, 227, 228, 0.38)',
		backdrop: 'rgba(42, 50, 53, 0.4)'
	}
};
