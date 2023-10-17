import { MD3Theme } from 'react-native-paper/src/types';
import { MD3LightTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const LightTheme: ThemeProp = {
	...MD3LightTheme,
	colors: {
		primary: 'rgb(0, 103, 128)',
		onPrimary: 'rgb(197,221,232)',
		primaryContainer: 'rgb(184, 234, 255)',
		onPrimaryContainer: 'rgb(0, 31, 40)',
		secondary: 'rgb(181, 34, 51)',
		onSecondary: 'rgb(197,221,232)',
		secondaryContainer: 'rgb(255, 218, 217)',
		onSecondaryContainer: 'rgb(65, 0, 8)',
		tertiary: 'rgb(0, 102, 137)',
		onTertiary: 'rgb(197,221,232)',
		tertiaryContainer: 'rgb(195, 232, 255)',
		onTertiaryContainer: 'rgb(0, 30, 44)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(197,221,232)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(251, 252, 254)',
		onBackground: 'rgb(23,47,58)',
		surface: 'rgb(251, 252, 254)',
		onSurface: 'rgb(23,47,58)',
		surfaceVariant: 'rgb(220, 228, 232)',
		onSurfaceVariant: 'rgb(23,47,58)',
		outline: 'rgb(112, 120, 124)',
		outlineVariant: 'rgb(191, 200, 204)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(46, 49, 50)',
		inverseOnSurface: 'rgb(239, 241, 242)',
		inversePrimary: 'rgb(93, 212, 252)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(238, 245, 248)',
			level2: 'rgb(231, 240, 244)',
			level3: 'rgb(223, 236, 240)',
			level4: 'rgb(221, 234, 239)',
			level5: 'rgb(216, 231, 236)'
		},
		surfaceDisabled: 'rgba(25, 28, 29, 0.12)',
		onSurfaceDisabled: 'rgba(25, 28, 29, 0.38)',
		backdrop: 'rgba(42, 50, 53, 0.4)'
	}
};
