import React, { Component } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import { NavigationProp } from '@react-navigation/native';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import DataHandler from '../../utility/DataHandler';
import { CompanyData } from '../../utility/DataHandlerTypes';
import LoadingScreen from '../../components/LoadingScreen';

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

	/**
	* Get resolved data from the server when the component gets mounted.
	*/
	componentDidMount() {
		this.getCompanyData();
	}

	/**
	 * Asynchronous function, gets company data through DataHandler.
	 * It fetches the company data, sorts it and updates the state.
	 * @returns {Promise<void>}
	 */
	private async getCompanyData(): Promise<void> {
		let data: CompanyData[] = await DataHandler.getCompanies();
		console.log(data);
		//Sorts the companies for their priority and then state.
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

	/**
	 * Handles the onPress event.
	 * It navigates to the ServiceList screen.
	 * @param {string} company - The company name.
	 * @param {string} id - The id of the company.
	 * @param {NavigationProp<any>} navigation - The navigation prop.
	 */
	private onPress(company: string, id: string, navigation: NavigationProp<any>): void {
		navigation.navigate('ServiceList', {
			company: company,
			id: id
		});
	}

	/**
	 * Handles the onRefresh event.
	 * It calls the getCompanyData method and then calls the finished callback.
	 * @param {() => void} finished - The callback to be called after refreshing.
	 */
	private onRefresh(finished: () => void): void {
		this.getCompanyData().then(() => finished());
	}

	/**
	 * filters the company list based on the query - SearchFunction.
	 * @param {CompanyData} company - The company data to be filtered.
	 * @returns {boolean} Whether the company data matches the query.
	 */
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
			<ContentContainer appBar={this.AppBar()} onRefresh={(finished) => this.onRefresh(finished)}>
				{this.state.loading ? (
					<LoadingScreen />
				) : (
					<ScrollView contentContainerStyle={styles.contentContainer} style={styles.view} horizontal={true}>
						<View style={{ width: '100%' }}>
							<FlatList
								style={{ height: '100%', paddingHorizontal: 16, paddingVertical: 8 }}
								showsVerticalScrollIndicator={false}
								data={this.state.companies.filter((value) => this.filterCompanyList(value))}
								renderItem={(info) => {
									let state: number = stateList.indexOf(info.item.state);
									if (info.item.secondaryState !== 'none') {
										state = 3;
									}
									return (
										<CompanyCard
											priority={info.item.priority}
											company={info.item.name}
											state={state}
											onPress={() => this.onPress(info.item.name, info.item.id ?? -1, this.props.navigation)}
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
