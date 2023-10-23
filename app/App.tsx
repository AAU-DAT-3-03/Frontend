import React, { Component, useEffect } from 'react';
import { AppRegistry, ColorSchemeName, useColorScheme } from 'react-native';
import BottomNavigationBar from './src/components/BottomNavigation';
import { DarkTheme } from './src/themes/DarkTheme';
import { LightTheme } from './src/themes/LightTheme';
import { PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

interface AppComponentProps {
	paperTheme: ThemeProp;
}

class AppComponent extends Component<AppComponentProps> {
	render() {
		return (
			<PaperProvider theme={this.props.paperTheme}>
				<BottomNavigationBar />
			</PaperProvider>
		);
	}
}

/**
 * React-native requires a hook style component as it's main component
 * @constructor
 */
function App() {
	const colorScheme: ColorSchemeName = useColorScheme();
	const paperTheme: ThemeProp = colorScheme === 'dark' ? DarkTheme : LightTheme;
	return <AppComponent paperTheme={paperTheme} />;
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
