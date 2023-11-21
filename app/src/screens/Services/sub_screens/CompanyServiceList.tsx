import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../../components/ContentContainer';
import { ScreenProps } from '../../../../App';

interface CompanyServiceLisState {
	company: number;
}

class CompanyServiceList extends Component<ScreenProps, CompanyServiceLisState> {
	state: CompanyServiceLisState = {
		company: -1
	};

	constructor(props: ScreenProps) {
		super(props);
		this.state.company = props.route.params?.company;
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<Appbar.Content title={`${this.state.company}`} />
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
