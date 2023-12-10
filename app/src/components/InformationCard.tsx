import React, { Component } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface InformationCardProps {
	errorType: string;
	errorInfo: string;
}

class InformationCard extends Component<InformationCardProps> {
	render(): React.JSX.Element {
		let textStyle = { ...informationStylesheet.logTitle, borderTopColor: getCurrentTheme().colors.onSurface };
		return (
			<ContainerCard>
				<ContainerCard.Header>
					<View style={informationStylesheet.header}>
						<Text variant={'titleLarge'}>Information</Text>
						<Text variant={'titleSmall'}>{this.props.errorType}</Text>
					</View>
				</ContainerCard.Header>
				<ContainerCard.Content>
					<View style={{ paddingHorizontal: 16 }}>
						<Text variant={'bodyLarge'} style={textStyle}>
							Log
						</Text>
						<Text>{this.props.errorInfo}</Text>
					</View>
				</ContainerCard.Content>
			</ContainerCard>
		);
	}
}

const informationStylesheet = StyleSheet.create({
	logTitle: {
		textAlign: 'center',
		paddingTop: 10
	},
	header: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		paddingBottom: 8
	}
});
export default InformationCard;
