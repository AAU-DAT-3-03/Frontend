import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../../components/ContentContainer';

interface CompanyServiceListProps {
	company: string;
}

interface CompanyServiceLisState {
	company: string;
}

class CompanyServiceList extends Component<CompanyServiceListProps, CompanyServiceLisState> {
	state: CompanyServiceLisState = {
		company: 'Not defined'
	};

	constructor(props: CompanyServiceListProps) {
		super(props);
		this.state.company = props.company;
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction onPress={() => {}} />
				<Appbar.Content title={this.state.company} />
			</Appbar>
		);
	}
	render(): React.JSX.Element {
		return (
			<>
				<ContentContainer appBar={this.AppBar()}>
					<Text variant={'displayLarge'}>test</Text>
				</ContentContainer>
			</>
		);
	}
}

export default CompanyServiceList;
