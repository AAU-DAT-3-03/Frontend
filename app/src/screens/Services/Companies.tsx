import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import CompanyServiceList from './sub_screens/CompanyServiceList';

const Stack = createStackNavigator();

class Companies extends Component {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Companies'} />
			</Appbar>
		);
	}

	private onPress(company: string, navigation: NavigationProp<any>): void {
		navigation.navigate('ServiceList', {
			company: company
		});
	}

	private servicesRender(navigation: NavigationProp<any>) {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<CompanyCard company={'TrendHim'} state={2} onPress={() => this.onPress('TrendHim', navigation)} />
				<CompanyCard company={'Bauhaus'} state={2} onPress={() => this.onPress('Bauhaus', navigation)} />
				<CompanyCard company={'Bilka'} state={2} onPress={() => this.onPress('Bilka', navigation)} />
				<CompanyCard company={'Rema1000'} state={1} onPress={() => this.onPress('Rema1000', navigation)} />
				<CompanyCard company={'Føtex'} state={1} onPress={() => this.onPress('Føtex', navigation)} />
				<CompanyCard company={'Coop'} state={1} onPress={() => this.onPress('Coop', navigation)} />
				<CompanyCard company={'AAU'} state={1} onPress={() => this.onPress('AAU', navigation)} />
				<CompanyCard company={'Aalborg Hospital'} state={0} onPress={() => this.onPress('Aalborg Hospital', navigation)} />
				<CompanyCard company={'Netic'} state={0} onPress={() => this.onPress('Netic', navigation)} />
				<CompanyCard company={'Trifork'} state={0} onPress={() => this.onPress('Trifork', navigation)} />
				<CompanyCard company={'Politi'} state={0} onPress={() => this.onPress('Politi', navigation)} />
				<CompanyCard company={'Kennedy Arkaden'} state={0} onPress={() => this.onPress('Kennedy Arkaden', navigation)} />
				<CompanyCard company={'Julemandens webside'} state={0} onPress={() => this.onPress('Julemandens webside', navigation)} />
				<CompanyCard company={'Apple'} state={0} onPress={() => this.onPress('Apple', navigation)} />
				<CompanyCard company={'Google'} state={0} onPress={() => this.onPress('Google', navigation)} />
				<CompanyCard company={'Samsung'} state={0} onPress={() => this.onPress('Samsung', navigation)} />
			</ContentContainer>
		);
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'ServiceRender'}>
				<Stack.Screen options={{ headerShown: false }} name="ServiceRender">
					{(props) => this.servicesRender(props.navigation)}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="ServiceList">
					{(props: any) => <CompanyServiceList {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		);
	}
}

export default Companies;
