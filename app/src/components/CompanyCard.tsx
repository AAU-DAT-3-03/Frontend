import React, { Component } from 'react';
import { IconButton, MD3Theme, Text, TouchableRipple } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { getCurrentTheme, Colors } from '../themes/ThemeManager';
import { PriorityColor } from './incidentCard/IncidentCard';
import ContainerCard from './ContainerCard';

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
		let barStyle = { ...cardStyle(getCurrentTheme()).colorStripe };
		let colorStripe: any = style.colorStripe;
		if (this.props.state === Status.ACKNOWLEDGED) {
			icon = 'account-check-outline';
			colorStripe = { ...barStyle, backgroundColor: Colors.warn };
		}
		return (
			<View style={style.iconContainer}>
				<IconButton
					icon={icon}
					iconColor={getCurrentTheme().colors.onError}
					size={25}
					containerColor={colorStripe.backgroundColor}
					style={{ marginRight: 16 }}
				/>
				<View style={style.barStyle}>
					<View
						style={
							this.props.state === Status.ERRORACKNOWLEDGED
								? { ...barStyle, backgroundColor: Colors.warn }
								: { ...barStyle, backgroundColor: undefined }
						}
					/>
					<View style={colorStripe} />
				</View>
			</View>
		);
	}

	render(): React.JSX.Element {
		let style = cardStyle(getCurrentTheme());
		return (
			<ContainerCard style={style.card}>
				<TouchableRipple
					style={{ borderRadius: style.cardContent.borderRadius }}
					borderless={true}
					onPress={() => this.props.onPress(this.props.company)}
				>
					<View style={style.cardContent}>
						<View style={style.textContainer}>
							<Text variant={'titleMedium'}>{this.props.company}</Text>
							{this.props.priority === -1 ? null : (
								<Text variant={'titleSmall'} style={{ color: PriorityColor(this.props.priority) }}>
									Priority {this.props.priority}
								</Text>
							)}
						</View>
						{this.props.state !== Status.NONE ? this.iconRender() : null}
					</View>
				</TouchableRipple>
			</ContainerCard>
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
			padding: 0,
			paddingLeft: 16
		},
		card: {
			paddingTop: 0,
			paddingBottom: 0,
			marginBottom: 8,
			marginTop: 8,
			backgroundColor: theme.colors.elevation.level2
		},
		error: {
			width: 16,
			height: '100%'
		},
		colorStripe: {
			backgroundColor: Colors.error,
			width: 16,
			height: '100%'
		},
		textContainer: {
			flexDirection: 'column',
			flexWrap: 'wrap',
			color: theme.colors.onSurface,
			paddingVertical: 16
		},
		barStyle: {
			flexDirection: 'row',
			gap: 0,
			height: '100%'
		},
		iconContainer: {
			height: '100%',
			flexDirection: 'row',
			flexWrap: 'nowrap',
			alignItems: 'center'
		}
	});
};
export default CompanyCard;
