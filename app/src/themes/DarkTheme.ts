import { MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const Colors = {
	warn: '#E1B000'
};

export const DarkTheme: MD3Theme = {
	...MD3DarkTheme,
	colors: {
		primary: 'rgb(132, 207, 255)',
		onPrimary: 'rgb(0, 52, 76)',
		primaryContainer: 'rgb(0, 76, 108)',
		onPrimaryContainer: 'rgb(199, 231, 255)',
		secondary: 'rgb(255, 179, 178)',
		onSecondary: 'rgb(104, 0, 18)',
		secondaryContainer: 'rgb(145, 5, 31)',
		onSecondaryContainer: 'rgb(255, 218, 216)',
		tertiary: 'rgb(102, 223, 108)',
		onTertiary: 'rgb(0, 57, 11)',
		tertiaryContainer: 'rgb(0, 83, 20)',
		onTertiaryContainer: 'rgb(131, 252, 133)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(25, 28, 30)',
		onBackground: 'rgb(226, 226, 229)',
		surface: 'rgb(25, 28, 30)',
		onSurface: 'rgb(226, 226, 229)',
		surfaceVariant: 'rgb(65, 72, 77)',
		onSurfaceVariant: 'rgb(193, 199, 206)',
		outline: 'rgb(139, 145, 152)',
		outlineVariant: 'rgb(65, 72, 77)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(226, 226, 229)',
		inverseOnSurface: 'rgb(46, 49, 51)',
		inversePrimary: 'rgb(0, 101, 142)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(30, 37, 41)',
			level2: 'rgb(34, 42, 48)',
			level3: 'rgb(37, 48, 55)',
			level4: 'rgb(38, 50, 57)',
			level5: 'rgb(40, 53, 62)'
		},
		surfaceDisabled: 'rgba(226, 226, 229, 0.12)',
		onSurfaceDisabled: 'rgba(226, 226, 229, 0.38)',
		backdrop: 'rgba(43, 49, 54, 0.4)'
	}
};
