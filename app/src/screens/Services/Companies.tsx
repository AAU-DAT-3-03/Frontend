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
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';

const Stack = createStackNavigator();

let stateList = ['none', 'acknowledged', 'error', 'errorAcknowledged'];

interface CompanyState {
	query: string;
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
		this.props.navigation.addListener('focus', () => {
			getCompanyData().then((value) =>
				this.setState({
					loading: false,
					companies: value
				})
			);
		});
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Searchbar
					onClearIconPress={() => this.setState({ query: '' })}
					style={{ backgroundColor: getCurrentTheme().colors.surfaceVariant }}
					placeholder={'Search'}
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
									.filter((value) => this.filterCompanyList(value))
									.sort((a, b) => {
										if (a.priority > b.priority) return 1;
										if (a.priority < b.priority) return -1;
										let aLessThanError = a.state === 'acknowledged' || a.state === 'none' || a.state === 'resolved';
										let bLessThanError = b.state === 'acknowledged' || b.state === 'none' || b.state === 'resolved';
										let aNone = a.state === 'none' || a.state === 'resolved';
										let bNone = b.state === 'none' || b.state === 'resolved';
										if (a.state === 'error' && bLessThanError) return -1;
										if (b.state === 'error' && aLessThanError) return 1;
										if (a.state === 'acknowledged' && bNone) return -1;
										if (b.state === 'acknowledged' && aNone) return 1;
										return 0;
									})}
								renderItem={(info) => {
									let state = 0;
									if (info.item.secondaryState === 'acknowledged') {
										state = 3;
									} else {
										state = stateList.indexOf(info.item.state);
									}
									return (
										<CompanyCard
											company={info.item.company}
											state={state}
											onPress={() => this.onPress(info.item.company, info.item.id ?? -1, navigation)}
											priority={info.item.priority}
										/>
									);
								}}
							/>
						</View>
					</ScrollView>
				)}
			</ContentContainer>
		);
	}

	private filterCompanyList(company: Company): boolean {
		if (this.state.query !== '') {
			let queries: [boolean, string][] = this.state.query
				.toLowerCase()
				.split(' ')
				.map((value) => [false, value]);
			for (let query of queries) {
				if (company.company.toLowerCase().includes(query[1].toLowerCase())) {
					query[0] = true;
					continue;
				}
				if (company.state.includes(query[1].toLowerCase())) {
					query[0] = true;
				}
			}
			return queries.filter((value) => value[0]).length === queries.length;
		}
		return true;
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
				<Stack.Screen options={{ headerShown: false }} name="IncidentCompanies">
					{(props: ScreenProps) => <Incident {...props} />}
				</Stack.Screen>
				<Stack.Screen options={{ headerShown: false }} name="AlarmCompanies">
					{(props: ScreenProps) => <Alarm {...props} />}
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
