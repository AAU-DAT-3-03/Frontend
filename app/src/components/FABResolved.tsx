import React, { Component } from 'react';
import { Button, FAB, IconButton, Modal, Portal, Text } from 'react-native-paper';
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
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	view: {
		paddingBottom: 16,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'column',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		width: 230,
		height: 153
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: getCurrentTheme().colors.primary,
		borderRadius: 20,
		width: '50%'
	},
	buttonview: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: '100%'
	},
	text: {
		paddingBottom: 16,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		width: '60%'
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
						<View style={styles.buttonview}>
							<IconButton
								icon="close-thick"
								iconColor={getCurrentTheme().colors.onBackground}
								size={20}
								onPress={() => this.props.onDismiss()}
							/>
						</View>
						<Text style={styles.text}>Are you sure you want to resolve this incident? (Hold To Resolve)</Text>
						<View>
							<Button
								style={styles.button}
								icon="check"
								mode="contained"
								onLongPress={() => {
									console.log('Pressed');
									this.props.onDismiss();
								}}
								delayLongPress={3000}
								onPressIn={() => {
									console.log('pressing in');
								}}
							>
								Resolve
							</Button>
						</View>
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
