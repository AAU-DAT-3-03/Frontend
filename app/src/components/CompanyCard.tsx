import React, { Component } from 'react';
import { Card, IconButton, MD3Theme, Text, TouchableRipple } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { getCurrentTheme, Colors } from '../themes/ThemeManager';
import { PriorityColor } from './incidentCard/IncidentCard';

enum Status {
	NONE,
	ACKNOWLEDGED,
	ERROR,
	ERRORACKNOWLEDGED
}

interface CompanyCardProps {
	company: string;
	state: Status;
	priority: number;
	onPress: (value: string) => void;
}

class CompanyCard extends Component<CompanyCardProps> {
	private iconRender(): React.JSX.Element {
		let icon = 'exclamation';
		let style = cardStyle(getCurrentTheme());
		let barStyle = style.error;
		if (this.props.state === Status.ACKNOWLEDGED) {
			icon = 'account-check-outline';
			barStyle = cardStyle(getCurrentTheme()).acknowledge;
		}
		return (
			<View style={style.iconContainer}>
				<IconButton
					icon={icon}
					iconColor={getCurrentTheme().colors.onError}
					size={25}
					containerColor={barStyle.backgroundColor}
					style={{ marginRight: 16 }}
				/>
				<View style={style.barStyle}>
					<View
						style={
							this.props.state === Status.ERRORACKNOWLEDGED ? style.acknowledge : { ...barStyle, backgroundColor: undefined }
						}
					/>
					<View style={barStyle} />
				</View>
			</View>
		);
	}

	render(): React.JSX.Element {
		let style = cardStyle(getCurrentTheme());
		return (
			<Card style={style.card} elevation={0}>
				<TouchableRipple
					style={{ borderRadius: style.cardContent.borderRadius }}
					borderless={true}
					onPress={() => this.props.onPress(this.props.company)}
				>
					<Card.Content style={style.cardContent}>
						<View style={style.beer}>
							<Text variant={'titleMedium'} adjustsFontSizeToFit={true} allowFontScaling={true} style={{ width: '100%' }}>
								{this.props.company}
							</Text>
							{this.props.priority === -1 ? null : (
								<Text variant={'titleSmall'} style={{ color: PriorityColor(this.props.priority) }}>
									Priority {this.props.priority}
								</Text>
							)}
						</View>
						{this.props.state !== Status.NONE ? this.iconRender() : null}
					</Card.Content>
				</TouchableRipple>
			</Card>
		);
	}
}

const cardStyle = (theme: MD3Theme) => {
	return StyleSheet.create({
		cardContent: {
			borderRadius: 16,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingRight: 0,
			paddingTop: 0,
			paddingBottom: 0,
			height: '100%'
		},
		card: {
			marginBottom: 8,
			marginTop: 8,
			backgroundColor: theme.colors.elevation.level2,
			height: 88
		},
		error: {
			backgroundColor: Colors.error,
			width: 14,
			height: '100%'
		},
		acknowledge: {
			backgroundColor: Colors.warn,
			width: 14,
			height: '100%'
		},
		beer: {
			flexDirection: 'column',
			flexWrap: 'wrap',
			color: theme.colors.onSurface
		},
		barStyle: {
			flexDirection: 'row',
			gap: 0,
			height: '100%'
		},
		iconContainer: {
			height: '100%',
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignItems: 'center'
		}
	});
};
export default CompanyCard;
