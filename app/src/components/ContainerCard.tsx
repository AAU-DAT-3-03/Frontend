import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface CardProps {
	children: React.ReactNode | React.ReactNode[] | undefined;
	style?: StyleProp<any>;
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
	state = {
		header: false,
		content: false
	};
	static Header: (props: CardProps) => React.JSX.Element = (props: CardProps) => <Header style={props.style}>{props.children}</Header>;
	static Content: (props: CardProps) => React.JSX.Element = (props: CardProps) => <Content style={props.style}>{props.children}</Content>;

	render(): React.JSX.Element {
		let style: StyleProp<ViewStyle>;
		if (this.props.style !== undefined) {
			style = { ...cardStyle().card, ...this.props.style };
		} else {
			style = cardStyle().card;
		}
		return <View style={style}>{this.props.children}</View>;
	}
}

const cardStyle = () => {
	return StyleSheet.create({
		card: {
			width: '100%',
			paddingVertical: 16,
			borderRadius: 16,
			backgroundColor: getCurrentTheme().colors.elevation.level2
		},
		header: {
			borderBottomColor: getCurrentTheme().colors.outline,
			borderBottomWidth: 1
		}
	});
};

export default ContainerCard;
