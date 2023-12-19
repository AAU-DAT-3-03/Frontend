import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../ContainerCard';
import { AlarmResponse, IncidentResponse } from '../../utility/DataHandlerTypes';
import IncidentCardHeader from './IncidentCardHeader';
import IncidentCardList from './IncidentCardList';

/**
 * Get the correct color for the priority indicator
 * @param {number} priority - The priority 1-4, anything outside range returns transparent
 * @return {string} - Returns the colour for the priority
 */
export const PriorityColor = (priority: number): string => {
	switch (priority) {
		case 1:
			return '#B80000';
		case 2:
			return '#FF511A';
		case 3:
			return '#FF9416';
		case 4:
			return '#FFD66C';
		default:
			return 'transparent';
	}
};

interface IncidentCardProps {
	incident: IncidentResponse;
	onClickIncident: (id: string) => void;
	onClickAlarm: (id: string, alarm: AlarmResponse) => void;
}

interface IncidentCardState {
	collapsed: boolean;
}

class IncidentCard extends Component<IncidentCardProps, IncidentCardState> {
	state: IncidentCardState = {
		collapsed: true
	};

	/**
	 * Is called when an update to the component is requested. This sets the rules for when the component can update.
	 * The reason for this is to avoid unnecessary updates, which will cause lag when there is a lot of incidents.
	 * @param nextProps {Readonly<IncidentCardProps>} - The updated props for the component
	 * @param nextState {Readonly<IncidentCardState>} - The updated state for the component
	 * @param nextContext {any} - The updated context for the component
	 * @return {boolean} - Whether the component should update
	 */
	shouldComponentUpdate(nextProps: Readonly<IncidentCardProps>, nextState: Readonly<IncidentCardState>, nextContext: any): boolean {
		// Update if the incident has changed
		if (nextProps.incident !== this.props.incident) return true;
		// Update if the collapse button has been pressed
		return nextState.collapsed !== this.state.collapsed;
	}

	render(): React.JSX.Element {
		return (
			<ContainerCard style={incidentCardStyle().containerCard}>
				<ContainerCard.Content>
					<IncidentCardHeader
						collapsed={this.state.collapsed}
						onClickButton={() => this.setState({ collapsed: !this.state.collapsed })}
						incident={this.props.incident}
						onClickIncident={() => this.props.onClickIncident(this.props.incident.id)}
					/>
					<View style={incidentCardStyle().list}>
						{/* If the card isn't collapsed show the list of alarms */}
						{this.state.collapsed ? null : (
							<IncidentCardList
								alarms={this.props.incident.alarms}
								onClickAlarm={(id: string, alarm: AlarmResponse) => this.props.onClickAlarm(id, alarm)}
							/>
						)}
					</View>
				</ContainerCard.Content>
			</ContainerCard>
		);
	}
}

const incidentCardStyle = () => {
	return StyleSheet.create({
		headerContainer: {
			paddingTop: 4,
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		headerRipple: {
			borderRadius: 16
		},
		headerSection: {
			flexShrink: 2,
			overflow: 'hidden',
			paddingLeft: 4,
			flexDirection: 'row',
			alignItems: 'center'
		},
		list: {
			width: '100%'
		},
		listItem: {
			backgroundColor: getCurrentTheme().colors.elevation.level2,
			padding: 16,
			width: '100%'
		},
		listItemAlternate: {
			backgroundColor: getCurrentTheme().colors.elevation.level4,
			padding: 16,
			width: '100%'
		},
		containerCard: {
			paddingBottom: 0
		}
	});
};
export default IncidentCard;
