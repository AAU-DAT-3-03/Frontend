import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../../components/ContentContainer';
import { ScreenProps } from '../../../../App';
import { StyleSheet, View } from 'react-native';

interface CompanyServiceLisState {
	company: string;
	id: number;
}

class CompanyServiceList extends Component<ScreenProps, CompanyServiceLisState> {
	state: CompanyServiceLisState = {
		company: 'Not defined',
		id: 0
	};

	constructor(props: ScreenProps) {
		super(props);
		this.state.company = props.route.params?.companyName;
		this.state.id = props.route.params?.companyId;
	}

	private AppBar(): React.JSX.Element {
		return (
			<>
				<Appbar.BackAction
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<View>
					<Text style={cslStyle().headerText} variant={'titleLarge'}>
						{this.state.company}
					</Text>
				</View>
			</>
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

const cslStyle = () => {
	return StyleSheet.create({
		headerText: {
			width: '100%',
			paddingRight: 110,
			textAlign: 'center'
		}
	});
};

export default CompanyServiceList;
