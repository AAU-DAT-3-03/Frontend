import React, { Component } from 'react';
import { Card, IconButton, Modal, Portal, SegmentedButtons, Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface PrioritySelectorProps {
	onPress: (value: number | undefined) => void;
	state: number | undefined;
	editable?: boolean;
}
interface PrioritySelectorState {
	selectedButton: number | undefined;
	visible: boolean;
	selectedValue: number | undefined;
}

interface PriorityConfirmProps {
	onConfirm: () => void;
	visible: boolean;
	onDismiss: () => void;
}

class PriorityConfirm extends Component<PriorityConfirmProps> {
	state = { assignVisible: false, resolvedActive: false };

	render(): React.JSX.Element {
		let buttonStyle = {
			...styles.resolveButton,
			backgroundColor: getCurrentTheme().colors.onPrimary
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
						<Text style={styles.fabtext}>Are you sure you want to change the Priority of this? </Text>

						<View>
							<TouchableRipple
								style={{ borderRadius: buttonStyle.borderRadius }}
								onPress={() => {
									this.props.onConfirm();
								}}
								borderless={true}
							>
								<View style={buttonStyle}>
									<Text style={styles.text} variant={'bodyLarge'}>
										Confirm
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

class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
	state: PrioritySelectorState = {
		selectedValue: this.props.state,
		visible: false,
		selectedButton: this.props.state
	};

	render(): React.JSX.Element {
		const { selectedValue } = this.state;
		return (
			<ContainerCard>
				<PriorityConfirm
					onConfirm={() => {
						this.setState({ selectedValue: this.state.selectedButton, visible: false });
						this.props.onPress(this.state.selectedButton);
					}}
					visible={this.state.visible}
					onDismiss={() => {
						this.setState({ visible: false });
					}}
				/>
				<Card.Content style={styles.card}>
					<Text variant={'titleMedium'} style={styles.title}>
						Priority
					</Text>
					{this.props.editable === true ? (
						<SegmentedButtons
							value={`${selectedValue}`}
							density={'small'}
							onValueChange={(value) => {
								this.setState({ selectedButton: parseInt(value, 10) });
							}}
							buttons={[
								{
									value: '1',
									label: 'P1',
									disabled: selectedValue === 1,
									style: changeButtonStyle(1, selectedValue),
									onPress: () => {
										this.setState({ visible: true });
									}
								},
								{
									value: '2',
									label: 'P2',
									disabled: selectedValue === 2,
									style: changeButtonStyle(2, selectedValue),
									onPress: () => {
										this.setState({ visible: true });
									}
								},
								{
									value: '3',
									label: 'P3',
									disabled: selectedValue === 3,
									style: changeButtonStyle(3, selectedValue),
									onPress: () => {
										this.setState({ visible: true });
									}
								},
								{
									value: '4',
									label: 'P4',
									disabled: selectedValue === 4,
									style: changeButtonStyle(4, selectedValue),
									onPress: () => {
										this.setState({ visible: true });
									}
								}
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

const changeButtonStyle = (buttonValue: number, selectedValue: number | undefined) => {
	const selected = buttonValue === selectedValue;
	return {
		backgroundColor: selected ? getCurrentTheme().colors.inversePrimary : getCurrentTheme().colors.surfaceVariant,
		borderWidth: 0,
		borderColor: 'transparent'
	};
};

const styles = StyleSheet.create({
	card: {
		alignItems: 'center',
		backgroundColor: getCurrentTheme().colors.elevation.level2,
		padding: 0
	},
	title: {
		paddingBottom: 8
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		gap: 16,
		alignItems: 'center'
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
export default PrioritySelector;
