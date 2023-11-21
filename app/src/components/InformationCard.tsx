import { Component } from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
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
			<Card>
				<ContainerCard.Header>
					<Card.Title
						titleStyle={{ textAlign: 'center' }}
						title={'Information'}
						subtitleStyle={{ textAlign: 'center' }}
						subtitle={this.props.errorType}
					/>
				</ContainerCard.Header>
				<Card.Content>
					<Text variant={'bodyLarge'} style={textStyle}>
						Log
					</Text>
					<Text>{this.props.errorInfo}</Text>
				</Card.Content>
			</Card>
		);
	}
}

const informationStylesheet = StyleSheet.create({
	logTitle: {
		textAlign: 'center',
		paddingTop: 10
	}
});
export default InformationCard;
