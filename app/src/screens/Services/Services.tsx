import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { ScrollView } from 'react-native';
import CompanyCard from '../../components/CompanyCard';

class Services extends Component {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Companies'} />
			</Appbar>
		);
	}
	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<ScrollView>
					<CompanyCard company={'TrendHim'} state={2} onPress={() => {}} />
					<CompanyCard company={'Bauhaus'} state={2} onPress={() => {}} />
					<CompanyCard company={'Bilka'} state={2} onPress={() => {}} />
					<CompanyCard company={'Rema1000'} state={1} onPress={() => {}} />
					<CompanyCard company={'Føtex'} state={1} onPress={() => {}} />
					<CompanyCard company={'Coop'} state={1} onPress={() => {}} />
					<CompanyCard company={'AAU'} state={1} onPress={() => {}} />
					<CompanyCard company={'Aalborg Hospital'} state={0} onPress={() => {}} />
					<CompanyCard company={'Netic'} state={0} onPress={() => {}} />
					<CompanyCard company={'Trifork'} state={0} onPress={() => {}} />
					<CompanyCard company={'Politi'} state={0} onPress={() => {}} />
					<CompanyCard company={'Kennedy Arkaden'} state={0} onPress={() => {}} />
					<CompanyCard company={'Julemandens webside'} state={0} onPress={() => {}} />
					<CompanyCard company={'Apple'} state={0} onPress={() => {}} />
					<CompanyCard company={'Google'} state={0} onPress={() => {}} />
					<CompanyCard company={'Samsung'} state={0} onPress={() => {}} />
				</ScrollView>
			</ContentContainer>
		);
	}
}

export default Services;
