import React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import BottomNavigationBar from './src/components/BottomNavigation';

function App(): React.JSX.Element {
	return (
		<PaperProvider>
			<BottomNavigationBar />
		</PaperProvider>
	);
}

export default App;

AppRegistry.registerComponent('NeticApp', () => App);
