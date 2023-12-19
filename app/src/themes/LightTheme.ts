import { MD3LightTheme, MD3Theme } from 'react-native-paper';

//  the color scheme for the light theme in the application
export const LightTheme: MD3Theme = {
	...MD3LightTheme,
	colors: {
		primary: 'rgb(48, 82, 209)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(221, 225, 255)',
		onPrimaryContainer: 'rgb(0, 19, 85)',
		secondary: 'rgb(103, 78, 173)',
		onSecondary: 'rgb(255, 255, 255)',
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
		background: 'rgb(254, 251, 255)',
		onBackground: 'rgb(27, 27, 31)',
		surface: 'rgb(240, 240, 243)',
		onSurface: 'rgb(27, 27, 31)',
		surfaceVariant: 'rgb(226, 225, 236)',
		onSurfaceVariant: 'rgb(69, 70, 79)',
		outline: 'rgb(118, 118, 128)',
		outlineVariant: 'rgb(198, 197, 208)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(48, 48, 52)',
		inverseOnSurface: 'rgb(242, 240, 244)',
		inversePrimary: 'rgb(184, 195, 255)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(244, 243, 253)',
			level2: 'rgb(238, 238, 251)',
			level3: 'rgb(231, 232, 250)',
			level4: 'rgb(229, 231, 250)',
			level5: 'rgb(225, 227, 249)'
		},
		surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
		onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
		backdrop: 'rgba(47, 48, 56, 0.4)'
	}
};
