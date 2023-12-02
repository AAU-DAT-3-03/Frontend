import React, { Component } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import CompanyServiceList from './sub_screens/CompanyServiceList';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ScreenProps } from '../../../App';
import { getCurrentTheme } from '../../themes/ThemeManager';
import DataHandler from '../../utility/DataHandler';
import { CompanyData } from '../../utility/DataHandlerTypes';
import Incident from '../incident/Incident';
import Alarm from '../alarm/Alarm';

const Stack = createStackNavigator();

let stateList = ['none', 'acknowledged', 'error'];

interface CompanyState {
	query: string;
	loading: boolean;
	companies: CompanyData[];
	state: number;
}

class Companies extends Component<any, CompanyState> {
	state: CompanyState = {
		loading: true,
		companies: [],
		query: '',
		state: 0
	};

	componentDidMount() {
		this.getCompanyData();
	}

	private async getCompanyData(): Promise<void> {
		let data: CompanyData[] = await DataHandler.getCompanies();
		data = data.sort((a, b) => {
			if (a.priority === -1) return 1;
			if (b.priority === -1) return -1;
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
		});
		this.setState({
			loading: false,
			companies: data
		});
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar.Header style={{ backgroundColor: getCurrentTheme().colors.surface }}>
				<Searchbar
					onClearIconPress={() => this.setState({ query: '' })}
					style={{ backgroundColor: getCurrentTheme().colors.surfaceVariant }}
					placeholder={'Search'}
					showDivider={false}
					value={this.state.query}
					onChange={(e) => this.setState({ query: e.nativeEvent.text })}
				/>
			</Appbar.Header>
		);
	}

	private onPress(company: string, id: string, navigation: NavigationProp<any>): void {
		navigation.navigate('ServiceList', {
			company: company,
			id: id
		});
	}

	private onRefresh(finished: () => void): void {
		this.getCompanyData().then(() => finished());
	}

	private servicesRender(navigation: NavigationProp<any>) {
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
				{this.state.loading ? (
					<View style={styles.activity}>
						<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					</View>
				) : (
					<ScrollView contentContainerStyle={styles.contentContainer} style={styles.view} horizontal={true}>
						<View style={{ width: '100%' }}>
							<FlatList
								ListFooterComponent={<View style={{ padding: 8 }} />}
								style={{ height: '100%', padding: 16 }}
								showsVerticalScrollIndicator={false}
								data={this.state.companies.filter((value) => this.filterCompanyList(value))}
								renderItem={(info) => (
									<CompanyCard
										priority={info.item.priority}
										company={info.item.name}
										state={stateList.indexOf(info.item.state)}
										onPress={() => this.onPress(info.item.name, info.item.id ?? -1, navigation)}
									/>
								)}
							/>
						</View>
					</ScrollView>
				)}
			</ContentContainer>
		);
	}

	private filterCompanyList(company: CompanyData): boolean {
		if (this.state.query !== '') {
			let queries: [boolean, string][] = this.state.query
				.toLowerCase()
				.split(' ')
				.map((value) => [false, value]);
			for (let query of queries) {
				if (company.name.toLowerCase().includes(query[1].toLowerCase())) {
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
