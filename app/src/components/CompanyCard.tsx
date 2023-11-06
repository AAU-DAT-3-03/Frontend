import React, { Component } from 'react';
import { Card, IconButton, Title, TouchableRipple } from 'react-native-paper';
import { View } from 'react-native';

enum Status {
	NONE,
	ACKNOWLEDGED,
	ERROR
}

interface CompanyCardProps {
	company: string;
	state: Status;
}

interface CompanyCardState {
	state: Status;
}

class CompanyCard extends Component<CompanyCardProps, CompanyCardState> {
	state: CompanyCardState = {
		state: Status.NONE
	};

	constructor(props: CompanyCardProps) {
		super(props);
		this.state.state = props.state;
	}

	private acknowledgeIconRender() {
		return (
			<>
				<IconButton icon="account-check-outline" iconColor={'white'} size={25} style={[{ backgroundColor: '#E1B000' }]} />
				<View style={{ backgroundColor: '#E1B000', width: 14, height: '100%' }} />
			</>
		);
	}

	render(): React.JSX.Element {
		return (
			<TouchableRipple onPress={() => console.log(1)} rippleColor={'rgba(255, 255, 255, 0.3)'}>
				<Card>
					<Card.Content
						style={{
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							backgroundColor: '#050506',
							borderWidth: 1,
							borderColor: 'grey',
							borderRadius: 5,
							alignItems: 'center',
							paddingRight: 0,
							paddingTop: 0,
							paddingBottom: 0,
							height: 80
						}}
					>
						<Title style={{ color: 'white', flex: 6 }}>{this.props.company}</Title>
						{this.state.state === Status.ACKNOWLEDGED ? this.acknowledgeIconRender() : null}
					</Card.Content>
				</Card>
			</TouchableRipple>
		);
	}
}

export default CompanyCard;
