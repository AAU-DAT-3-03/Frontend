import { MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const DarkTheme: MD3Theme = {
	...MD3DarkTheme,
	colors: {
		primary: 'rgb(48, 82, 180)',
		onPrimary: 'rgb(0, 36, 135)',
		primaryContainer: 'rgb(221, 225, 255)',
		onPrimaryContainer: 'rgb(221, 225, 255)',
		secondary: 'rgb(103, 78, 173)',
		onSecondary: 'rgb(55, 26, 123)',
		secondaryContainer: 'rgb(232, 221, 255)',
		onSecondaryContainer: 'rgb(33, 0, 93)',
		tertiary: 'rgb(155, 55, 125)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(255, 216, 236)',
		onTertiaryContainer: 'rgb(59, 0, 45)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(27, 27, 36)',
		onBackground: 'rgb(228, 225, 230)',
		surface: 'rgb(35, 35, 50)',
		onSurface: 'rgb(228, 225, 230)',
		surfaceVariant: 'rgb(69, 70, 86)',
		onSurfaceVariant: 'rgb(198, 197, 208)',
		outline: 'rgb(144, 144, 154)',
		outlineVariant: 'rgb(69, 70, 79)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(228, 225, 230)',
		inverseOnSurface: 'rgb(48, 48, 52)',
		inversePrimary: 'rgb(48, 82, 209)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(35, 35, 42)',
			level2: 'rgb(40, 40, 49)',
			level3: 'rgb(44, 46, 56)',
			level4: 'rgb(46, 47, 58)',
			level5: 'rgb(49, 51, 62)'
		},
		surfaceDisabled: 'rgba(228, 225, 230, 0.12)',
		onSurfaceDisabled: 'rgba(228, 225, 230, 0.38)',
		backdrop: 'rgba(47, 48, 56, 0.4)'
	}
};
