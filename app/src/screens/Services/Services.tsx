import React, { Component } from 'react';
import { Appbar, Button, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import Incident from '../incident/Incident';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { ScreenProps } from '../../../App';
import CompanyServiceList from './sub_screens/CompanyServiceList';

const Stack = createStackNavigator();

class Services extends Component {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Services'} />
			</Appbar>
		);
	}

	private servicesRender(navigation: NavigationProp<any>): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<Button
					onPress={() =>
						navigation.navigate('CompanyServiceList', {
							companyId: 1,
							companyName: 'Jysk'
						})
					}
				>
					Jysk
				</Button>
			</ContentContainer>
		);
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'Home'}>
				<Stack.Screen options={{ headerShown: false }} name="ServiceRender">
					{(props: ScreenProps) => this.servicesRender(props.navigation)}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="CompanyServiceList">
					{(props: ScreenProps) => <CompanyServiceList {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		);
	}
}

export default Services;
