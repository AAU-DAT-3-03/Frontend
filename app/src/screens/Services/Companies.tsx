import React, { Component } from 'react';
import { Searchbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import CompanyServiceList from './sub_screens/CompanyServiceList';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ScreenProps } from '../../../App';
import { Company, MockDataGenerator } from '../../utility/MockDataGenerator';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../../components/ContainerCard';

const Stack = createStackNavigator();

let stateList = ['none', 'acknowledged', 'error'];

interface CompanyState {
	query: any;
	loading: boolean;
	companies: Company[];
	state: number;
}

async function getCompanyData() {
	let promise: Promise<Company[]> = new Promise((resolve): void => {
		setTimeout(() => {
			resolve(MockDataGenerator.getCompanies());
		}, 100);
	});
	return await promise;
}

class Companies extends Component<any, CompanyState> {
	state: CompanyState = {
		loading: true,
		companies: [],
		query: '',
		state: 0
	};

	componentDidMount() {
		getCompanyData().then((value) =>
			this.setState({
				loading: false,
				companies: value
			})
		);
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Searchbar
					onClearIconPress={() => this.setState({ query: '' })}
					style={styles.bar}
					placeholder={'Search'}
					mode={'bar'}
					showDivider={false}
					value={this.state.query}
					onChange={(e) => this.setState({ query: e.nativeEvent.text })}
				/>
			</>
		);
	}

	private onPress(company: string, id: number, navigation: NavigationProp<any>): void {
		navigation.navigate('ServiceList', {
			company: company,
			id: id
		});
	}

	private servicesRender(navigation: NavigationProp<any>) {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<View style={styles.activity}>
						<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					</View>
				) : (
					<ScrollView contentContainerStyle={styles.contentContainer} style={styles.view} horizontal={true}>
						<View style={{ width: '100%' }}>
							<FlatList
								ListFooterComponent={<View style={{ padding: 8 }} />}
								style={{ padding: 8, height: '100%' }}
								showsVerticalScrollIndicator={false}
								data={this.state.companies
									.filter(
										(value) =>
											value.company.toLowerCase().includes(this.state.query.toLowerCase()) ||
											value.state.includes(this.state.query.toLowerCase())
									)
									.sort((a, b) => {
										if (a.state === 'acknowledged' && b.state === 'error') return 1;
										if (a.state === 'error' && b.state === 'acknowledged') return -1;
										if (a.state === 'none' && b.state !== 'none') return 1;
										if (a.state !== 'none' && b.state === 'none') return -1;
										return 0;
									})}
								renderItem={(info) => (
									<CompanyCard
										company={info.item.company}
										state={stateList.indexOf(info.item.state)}
										onPress={() => this.onPress(info.item.company, info.item.id ?? -1, navigation)}
									/>
								)}
							/>
						</View>
					</ScrollView>
				)}
			</ContentContainer>
		);
	}

	render(): React.JSX.Element {
		return (
			<Stack.Navigator initialRouteName={'ServiceRender'}>
				<Stack.Screen options={{ headerShown: false }} name="ServiceRender">
					{(props: ScreenProps) => this.servicesRender(props.navigation)}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="ServiceList">
					{(props: ScreenProps) => <CompanyServiceList {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		);
	}
}

const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		width: '100%'
	},
	contentContainer: {
		flex: 1,
		width: '100%'
	},
	bar: {
		alignItems: 'center'
	},
	activity: {
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Companies;
