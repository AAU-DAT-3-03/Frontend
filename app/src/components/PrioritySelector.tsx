import React, { Component } from 'react';
import { SegmentedButtons } from 'react-native-paper';

import { getCurrentTheme } from '../themes/ThemeManager';

enum Status {
	'Priority1',
	'Priority2',
	'Priority3',
	'Priority4'
}

interface PrioritySelectorProps {
	state: Status;
	value: string;
	onPress: () => void;
}
interface PrioritySelectorState {
	state: Status;
}
class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		state: Status.Priority3
	};

	render(): React.JSX.Element {
		return (
			<SegmentedButtons
				value={this.state.state}
				density={'small'}
				onValueChange={() => {
					this.setState({ value: this.state.state });
				}}
				buttons={[
					{ value: this.state.state, label: 'P1' },
					{ value: this.state.state, label: 'P2' },
					{ value: this.state.state, label: 'P3' },
					{ value: this.state.state, label: 'P4' }
				]}
			/>
		);
	}
}

export default PrioritySelector;
