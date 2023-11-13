import React, { Component } from 'react';
import { FAB, Icon, IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';

interface ResolvedProps {
	visible: boolean;
	onDismiss: () => void;
	resolvedActive: boolean;
}

class ResolvedConfirm extends Component<ResolvedProps> {
	state = { assignVisible: false, resolvedActive: false };
	render(): React.JSX.Element {
		let buttonStyle = {
			...styles.resolveButton,
			backgroundColor: !this.props.resolvedActive ? getCurrentTheme().colors.onSurfaceDisabled : getCurrentTheme().colors.onPrimary
		};
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
						<Text>Are you sure you want to resolve this incident?</Text>
						<View>
							<TouchableRipple
								style={{ borderRadius: buttonStyle.borderRadius }}
								disabled={!this.props.resolvedActive}
								onPress={() => {
									console.log('Pressed');
									this.props.onDismiss();
								}}
								borderless={true}
							>
								<View style={buttonStyle}>
									{!this.props.resolvedActive ? (
										<ActivityIndicator
											size={24}
											animating={true}
											color={getCurrentTheme().colors.inverseSurface}
										></ActivityIndicator>
									) : (
										<Icon size={24} source={'check'}></Icon>
									)}
									<Text style={styles.text} variant={'bodyLarge'}>
										Resolve
									</Text>
								</View>
							</TouchableRipple>
						</View>
					</View>
				</Modal>
			</Portal>
		);
	}
}

class FABResolved extends Component {
	state = { assignVisible: false, resolvedActive: false };
	timeout: NodeJS.Timeout | undefined;
	private resolvedTimeout(): void {
		this.setState({ assignVisible: true });
		this.timeout = setTimeout((): void => {
			this.setState({ resolvedActive: true });
		}, 5000);
	}

	render(): React.JSX.Element {
		return (
			<Portal>
				<View style={styles.fab}>
					<FAB
						elevation={0}
						variant={'tertiary'}
						icon="check-bold"
						onPress={() => this.resolvedTimeout()}
						rippleColor={getCurrentTheme().colors.primary}
					/>
				</View>
				<ResolvedConfirm
					visible={this.state.assignVisible}
					resolvedActive={this.state.resolvedActive}
					onDismiss={() => {
						this.setState({ assignVisible: false }, () => {
							this.setState({ resolvedActive: false });
							if (this.timeout !== undefined) {
								clearTimeout(this.timeout);
								this.timeout = undefined;
							}
						});
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
		verticalAlign: 'middle'
	},
	resolveButton: {
		height: 48,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,

		gap: 16
	}
});

export default FABResolved;
