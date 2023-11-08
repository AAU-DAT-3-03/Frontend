import React, { Component } from 'react';
import { Button, FAB, Modal, Portal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

const styles = StyleSheet.create({
	fab: {
		backgroundColor: getCurrentTheme().colors.onTertiary,
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	view: {
		flexDirection: 'row-reverse',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		width: 230,
		height: 153
	},
	button: {
		alignItems: 'center',
		borderRadius: 20
	}
});

interface ResolvedProps {
	visible: boolean;
	onDismiss: () => void;
}

class ResolvedConfirm extends Component<ResolvedProps> {
	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					<View style={styles.view}>
						<Button style={styles.button} icon={'close-thick'} onPress={() => {}}></Button>
					</View>
				</Modal>
			</Portal>
		);
	}
}

class FABResolved extends Component {
	state = { assignVisible: false };

	render(): React.JSX.Element {
		return (
			<Portal>
				<FAB
					style={styles.fab}
					icon="check-bold"
					onPress={() => this.setState({ assignVisible: true })}
					rippleColor={getCurrentTheme().colors.primary}
				></FAB>
				<ResolvedConfirm
					visible={this.state.assignVisible}
					onDismiss={() => {
						this.setState({ assignVisible: false });
					}}
				></ResolvedConfirm>
			</Portal>
		);
	}
}

export default FABResolved;
