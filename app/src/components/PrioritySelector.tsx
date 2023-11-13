import React, { Component } from 'react';
import { SegmentedButtons } from 'react-native-paper';

type Status = 1 | 2 | 3 | 4;

interface PrioritySelectorProps {
	state: Status;
	onPress: (value: number) => void;
}
interface PrioritySelectorState {
	state: string;
}
class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		state: '4'
	};

	render(): React.JSX.Element {
		return (
			<SegmentedButtons
				value={this.state.state}
				density={'small'}
				onValueChange={(value) => {
					this.setState({ state: value });
					this.props.onPress(parseInt(value));
				}}
				buttons={[
					{ value: '1', label: 'P1' },
					{ value: '2', label: 'P2' },
					{ value: '3', label: 'P3' },
					{ value: '4', label: 'P4' }
				]}
			/>
		);
	}
}

export default PrioritySelector;
