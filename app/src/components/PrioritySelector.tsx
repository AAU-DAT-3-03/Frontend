import React, { Component } from 'react';
import { SegmentedButtons } from 'react-native-paper';

interface PrioritySelectorProps {
	onPress: (value: number | undefined) => void;
	state: number | undefined;
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
		);
	}
}

export default PrioritySelector;
