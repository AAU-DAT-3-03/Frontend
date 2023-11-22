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
	state: number | undefined;
}
class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		state: 4
	};

	constructor(props: PrioritySelectorProps) {
		super(props);
		this.state.state = props.state;
	}

	render(): React.JSX.Element {
		return (
			<ContainerCard>
				<Card.Content style={PriorityStylesheet.card}>
					<Text variant={'titleMedium'} style={PriorityStylesheet.title}>
						Priority
					</Text>
					{this.props.editable === true ? (
						<SegmentedButtons
							value={`${this.state.state}`}
							density={'small'}
							onValueChange={(value) => {
								this.setState({ state: parseInt(value) });
								this.props.onPress(parseInt(value, 10));
							}}
							buttons={[
								{ value: '1', label: 'P1' },
								{ value: '2', label: 'P2' },
								{ value: '3', label: 'P3' },
								{ value: '4', label: 'P4' }
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
