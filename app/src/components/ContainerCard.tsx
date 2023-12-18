import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

class HeaderRender extends Component<CardProps> {
	render(): React.JSX.Element {
		let style: StyleProp<ViewStyle>;

		// Append the style prop if given
		if (this.props.style !== undefined) {
			style = { ...cardStyle().header, ...this.props.style };
		} else {
			style = cardStyle().header;
		}

		return <View style={style}>{this.props.children}</View>;
	}
}

class ContentRender extends Component<CardProps> {
	render(): React.JSX.Element {
		return <View style={this.props.style}>{this.props.children}</View>;
	}
}

interface CardProps {
	children: React.ReactNode | React.ReactNode[] | undefined;
	style?: StyleProp<any>;
}

class ContainerCard extends Component<CardProps> {
	/**
	 * Header render for Container Card
	 * @param {CardProps} props - Optional child elements and styling
	 * @returns {React.JSX.Element} - The header render
	 */
	static Header: (props: CardProps) => React.JSX.Element = (props: CardProps): React.JSX.Element => (
		<HeaderRender style={props.style}>{props.children}</HeaderRender>
	);

	/**
	 * Content render for Container Card
	 * @param {CardProps} props - Optional child elements and styling
	 * @returns {React.JSX.Element} - The content render
	 */
	static Content: (props: CardProps) => React.JSX.Element = (props: CardProps): React.JSX.Element => (
		<ContentRender style={props.style}>{props.children}</ContentRender>
	);

	render(): React.JSX.Element {
		let style: StyleProp<ViewStyle>;

		// Append the style prop if given
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
