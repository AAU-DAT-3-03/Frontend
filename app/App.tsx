import React from 'react';
import { AppRegistry } from 'react-native';
import {PaperProvider, Text} from "react-native-paper";

function App(): React.JSX.Element {
  return (
    <PaperProvider>
        <Text>Test</Text>
    </PaperProvider>
  );
}

export default App;

AppRegistry.registerComponent("NeticApp", () => App);
