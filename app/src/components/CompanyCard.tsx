import React, { Component } from 'react';
import { Card, IconButton, Title, TouchableRipple } from 'react-native-paper';
import { Dimensions, View, StyleSheet } from 'react-native';
import { getCurrentTheme, Colors } from '../themes/ThemeManager';
import Color from 'color';

enum Status {
	NONE,
	ACKNOWLEDGED,
	ERROR
}

interface CompanyCardProps {
	company: string;
	state: Status;
	onPress: (value: string) => void;
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
				<IconButton icon="account-check-outline" iconColor={'white'} size={25} style={{ backgroundColor: Colors.warn }} />
				<View style={cardStyle().acknowledge} />
			</>
		);
	}

	private ErrorIconRender() {
		return (
			<>
				<IconButton icon="exclamation" iconColor={getCurrentTheme().colors.onError} size={25} containerColor={Colors.error} />
				<View style={cardStyle().error} />
			</>
		);
	}

	render(): React.JSX.Element {
		return (
			<Card style={cardStyle().card} elevation={0}>
				<TouchableRipple
					style={{ borderRadius: cardStyle().cardContent.borderRadius }}
					borderless={true}
					onPress={() => this.props.onPress(this.props.company)}
					rippleColor={Color(getCurrentTheme().colors.onSurface).alpha(0.3).toString()}
				>
					<Card.Content style={cardStyle().cardContent}>
						<Title style={cardStyle().beer}>{this.props.company}</Title>
						{this.state.state === Status.ACKNOWLEDGED ? this.acknowledgeIconRender() : null}
						{this.state.state === Status.ERROR ? this.ErrorIconRender() : null}
					</Card.Content>
				</TouchableRipple>
			</Card>
		);
	}
}

const cardStyle = () => {
	return StyleSheet.create({
		cardContent: {
			borderRadius: 16,
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			paddingRight: 0,
			paddingTop: 0,
			paddingBottom: 0,
			height: '100%'
		},
		card: {
			marginBottom: 8,
			marginTop: 8,
			backgroundColor: getCurrentTheme().colors.elevation.level2,
			height: Dimensions.get('screen').height / 17
		},
		error: {
			backgroundColor: Colors.error,
			width: 14,
			height: '100%',
			borderTopRightRadius: 10,
			borderBottomRightRadius: 10,
			marginRight: 0.4
		},
		acknowledge: {
			backgroundColor: Colors.warn,
			width: 14,
			height: '100%',
			borderTopRightRadius: 10,
			borderBottomRightRadius: 10,
			marginRight: 0.4
		},
		beer: {
			color: getCurrentTheme().colors.onSurface,
			flex: 6
		}
	});
};
export default CompanyCard;
