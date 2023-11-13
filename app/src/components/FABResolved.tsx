import React, { Component } from 'react';
import { Button, FAB, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface ResolvedProps {
	visible: boolean;
	onDismiss: () => void;
	resolvedActive: boolean;
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
						<Text style={styles.text}>Are you sure you want to resolve this incident?</Text>
						<View>
							<Button
								disabled={!this.props.resolvedActive}
								style={styles.button}
								icon="check"
								mode="contained"
								onPress={() => {
									console.log('Pressed');
									this.props.onDismiss();
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
	state = { assignVisible: false, resolvedActive: false };

	private resolvedTimeout(): void {
		this.setState({ assignVisible: true });
		setTimeout((): void => {
			this.setState({ resolvedActive: true });
		}, 5000);
	}

	render(): React.JSX.Element {
		return (
			<Portal>
				<FAB
					style={styles.fab}
					icon="check-bold"
					onPress={() => this.resolvedTimeout()}
					rippleColor={getCurrentTheme().colors.primary}
				/>
				<ResolvedConfirm
					visible={this.state.assignVisible}
					resolvedActive={this.state.resolvedActive}
					onDismiss={() => {
						this.setState({ assignVisible: false });
					}}
				/>
			</Portal>
		);
	}
}

const styles = StyleSheet.create({
	fab: {
		borderRadius: 40,
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
		borderRadius: 40,
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

export default FABResolved;
