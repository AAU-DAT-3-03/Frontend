import React, { Component } from 'react';
import { FAB, Icon, IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Colors, getCurrentTheme } from '../themes/ThemeManager';

interface ResolvedProps {
	onResolve: () => void;
	visible: boolean;
	onDismiss: () => void;
	resolvedActive: boolean;
	timer: number;
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
						<Text style={styles.fabtext}>
							Are you sure you want to resolve this incident?{' '}
							{this.props.timer < 1 ? null : `\nWait ${this.props.timer} seconds`}
						</Text>

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
	state = { assignVisible: false, resolvedActive: false, timer: 5 };
	timeout: NodeJS.Timeout | undefined;
	interval: NodeJS.Timeout | undefined;

	private resolvedTimeout(): void {
		this.setState({ assignVisible: true });
		this.interval = setInterval((): void => {
			if (this.state.timer === 0) {
				clearInterval(this.interval);
				this.interval = undefined;
				return;
			}
			this.setState({ timer: this.state.timer - 1 });
		}, 1000);
		this.timeout = setTimeout((): void => {
			this.setState({ resolvedActive: true });
		}, 5000);
	}

	render(): React.JSX.Element {
		return (
			<Portal>
				<FAB
					style={styles.fabbutton}
					elevation={0}
					icon="check-bold"
					onPress={() => this.resolvedTimeout()}
					rippleColor={getCurrentTheme().colors.primary}
				/>

				<ResolvedConfirm
					onResolve={() => {}}
					timer={this.state.timer}
					visible={this.state.assignVisible}
					resolvedActive={this.state.resolvedActive}
					onDismiss={() => {
						this.setState({ assignVisible: false }, () => {
							this.setState({ resolvedActive: false });
							if (this.interval !== undefined) {
								clearInterval(this.interval);
								this.interval = undefined;
							}
							if (this.timeout !== undefined) {
								clearTimeout(this.timeout);
								this.timeout = undefined;
							}
							this.setState({ timer: 5 });
						});
					}}
				/>
			</Portal>
		);
	}
}

const styles = StyleSheet.create({
	fabbutton: {
		top: '82%',
		right: 8,
		position: 'absolute',
		overflow: 'hidden',
		borderRadius: 30,
		backgroundColor: Colors.allGood
	},
	fab: {
		backgroundColor: getCurrentTheme().colors.onTertiary,
		position: 'relative',
		right: 5,
		bottom: '12%'
	},
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	fabtext: {
		paddingBottom: 10,
		textAlign: 'center'
	},
	view: {
		paddingLeft: 16,
		paddingRight: 16,
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
		backgroundColor: getCurrentTheme().colors.tertiary,
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
		alignItems: 'center',
		height: 48,
		flexDirection: 'row',
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 20,

		gap: 16
	}
});

export default FABResolved;
