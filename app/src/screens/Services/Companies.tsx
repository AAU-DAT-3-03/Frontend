import React, { Component } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import CompanyServiceList from './sub_screens/CompanyServiceList';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet } from 'react-native';
import { companies, randomInt } from '../home/IncidentGenerator';
import { ScreenProps } from '../../../App';

const Stack = createStackNavigator();

let stateList = ['none', 'acknowledged', 'error'];
interface CompanyData {
	service: string;
	id: number | undefined;
	state: number;
}

interface CompanyState {
	query: any;
	loading: boolean;
	companies: CompanyData[];
	state: number;
}

async function getCompanyData() {
	let promise: Promise<CompanyData[]> = new Promise((resolve): void => {
		setTimeout(() => {
			let companiesdata: CompanyData[] = [];
			for (let company of companies) {
				companiesdata.push({ service: company, state: randomInt(0, 2), id: randomInt(0, 100000000) });
			}
			resolve(companiesdata);
		}, 1500);
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
			<Appbar style={styles.app}>
				<Searchbar
					style={styles.bar}
					placeholder={'Search'}
					mode={'bar'}
					showDivider={false}
					value={this.state.query}
					onChange={(e) => this.setState({ query: e.nativeEvent.text })}
				/>
			</Appbar>
		);
	}

	private onPress(company: number, navigation: NavigationProp<any>): void {
		navigation.navigate('ServiceList', {
			company: company
		});
	}

	private servicesRender(navigation: NavigationProp<any>) {
		return (
			<ContentContainer appBar={this.AppBar()}>
				{this.state.loading ? (
					<ActivityIndicator />
				) : (
					<ScrollView contentContainerStyle={styles.contentContainer} style={styles.view} horizontal={true}>
						<FlatList
							showsVerticalScrollIndicator={false}
							data={this.state.companies
								.filter(
									(value) =>
										value.service.toLowerCase().includes(this.state.query.toLowerCase()) ||
										stateList[value.state].includes(this.state.query.toLowerCase())
								)
								.sort((a, b) => {
									if (a.state > b.state) return -1;
									if (a.state < b.state) return 1;
									return 0;
								})}
							renderItem={(info) => (
								<CompanyCard
									company={info.item.service}
									state={info.item.state ?? -1}
									onPress={() => this.onPress(info.item.id ?? -1, navigation)}
								/>
							)}
						/>
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
		width: '100%',
		padding: 16
	},
	contentContainer: {
		flex: 1,
		width: '100%'
	},
	bar: {
		margin: 8,
		alignItems: 'center'
	},
	app: {}
});

export default Companies;
