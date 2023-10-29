import React from 'react';
import { AppRegistry, ColorSchemeName, useColorScheme } from 'react-native';
import BottomNavigationBar from './src/components/BottomNavigation';
import { DarkTheme } from './src/themes/DarkTheme';
import { LightTheme } from './src/themes/LightTheme';
import { PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

function App(): React.JSX.Element {
	const colorScheme: ColorSchemeName = useColorScheme();
	const paperTheme: ThemeProp = colorScheme === 'dark' ? DarkTheme : LightTheme;

	return (
		<PaperProvider theme={paperTheme}>
			<BottomNavigationBar />
		</PaperProvider>
	);
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
