import React, { Component } from 'react';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface PrioritySelectorProps {
	onPress: (value: number | undefined) => void;
	state: number | undefined;
	editable?: boolean;
}
interface PrioritySelectorState {
	selectedValue: number | undefined;
}
class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		selectedValue: this.props.state
	};

	render(): React.JSX.Element {
		const { selectedValue } = this.state;
		return (
			<ContainerCard>
				<Card.Content style={PriorityStylesheet.card}>
					<Text variant={'titleMedium'} style={PriorityStylesheet.title}>
						Priority
					</Text>
					{this.props.editable === true ? (
						<SegmentedButtons
							value={`${selectedValue}`}
							density={'small'}
							onValueChange={(value) => {
								const intValue = parseInt(value, 10);
								this.setState({ selectedValue: intValue });
								this.props.onPress(intValue);
							}}
							buttons={[
								{ value: '1', label: 'P1', disabled: selectedValue === 1, style: changeButtonStyle(1, selectedValue) },
								{ value: '2', label: 'P2', disabled: selectedValue === 2, style: changeButtonStyle(2, selectedValue) },
								{ value: '3', label: 'P3', disabled: selectedValue === 3, style: changeButtonStyle(3, selectedValue) },
								{ value: '4', label: 'P4', disabled: selectedValue === 4, style: changeButtonStyle(4, selectedValue) }
							]}
						/>
					) : (
						<Text>P{this.props.state}</Text>
					)}
				</Card.Content>
			</ContainerCard>
		);
	}
}

const changeButtonStyle = (buttonValue: number, selectedValue: number | undefined) => {
	const selected = buttonValue === selectedValue;
	return {
		backgroundColor: selected ? getCurrentTheme().colors.inversePrimary : getCurrentTheme().colors.primaryContainer,
		borderWidth: 0,
		borderColor: 'transparent'
	};
};

const PriorityStylesheet = StyleSheet.create({
	card: {
		alignItems: 'center',
		backgroundColor: getCurrentTheme().colors.elevation.level2,
		padding: 0
	},
	title: {
		paddingBottom: 8
	}
});
export default PrioritySelector;
