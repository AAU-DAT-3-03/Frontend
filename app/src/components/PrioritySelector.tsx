import React, { Component } from 'react';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface PrioritySelectorProps {
	onPress: (value: number | undefined) => void;
	state: number | undefined;
}
interface PrioritySelectorState {
	selectedValue: number | undefined;
}
class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		selectedValue: this.props.state
	};

	//constructor(props: PrioritySelectorProps) {
	//super(props);
	//	this.state.state = props.state;
	//}

	render(): React.JSX.Element {
		const { selectedValue } = this.state;
		return (
			<ContainerCard>
				<Card.Content style={PriorityStylesheet.card}>
					<Text variant={'titleMedium'} style={PriorityStylesheet.title}>
						Priority
					</Text>
					<SegmentedButtons
						value={`${selectedValue}`}
						density={'small'}
						onValueChange={(value) => {
							const intValue = parseInt(value, 10);
							this.setState({ selectedValue: intValue });
							this.props.onPress(intValue);
						}}
						buttons={[
							{ value: '1', label: 'P1', disabled: selectedValue === 1 },
							{ value: '2', label: 'P2', disabled: selectedValue === 2 },
							{ value: '3', label: 'P3', disabled: selectedValue === 3 },
							{ value: '4', label: 'P4', disabled: selectedValue === 4 }
						]}
					/>
				</Card.Content>
			</ContainerCard>
		);
	}
}

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
