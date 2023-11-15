import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface CardProps {
	children: React.ReactNode | React.ReactNode[] | undefined;
}

class Header extends Component<CardProps> {
	render(): React.JSX.Element {
		return <View style={cardStyle().header}>{this.props.children}</View>;
	}
}

class Content extends Component<CardProps> {
	render(): React.JSX.Element {
		return <View>{this.props.children}</View>;
	}
}

class ContainerCard extends Component<CardProps> {
	static Header: (props: CardProps) => React.JSX.Element = (props: CardProps) => <Header>{props.children}</Header>;
	static Content: (props: CardProps) => React.JSX.Element = (props: CardProps) => <Content>{props.children}</Content>;

	render(): React.JSX.Element {
		return <View style={cardStyle().card}>{this.props.children}</View>;
	}
}

const cardStyle = () => {
	return StyleSheet.create({
		card: {
			width: '100%',
			paddingVertical: 16,
			borderRadius: 16,
			backgroundColor: getCurrentTheme().colors.surface
		},
		header: {
			borderBottomColor: getCurrentTheme().colors.outline,
			borderBottomWidth: 1
		}
	});
};

export default ContainerCard;
