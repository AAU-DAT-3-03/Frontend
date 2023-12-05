import React, { Component } from 'react';
import { Button, Card, IconButton, Modal, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface PrioritySelectorProps {
	onPress: (value: number, text: string) => void;
	state: number;
	editable?: boolean;
}
interface PrioritySelectorState {
	selectedButton: number;
	visible: boolean;
	selectedValue: number;
}

interface PriorityConfirmProps {
	onConfirm: (text: string) => void;
	visible: boolean;
	onDismiss: () => void;
}

class PriorityConfirm extends Component<PriorityConfirmProps> {
	state = {
		assignVisible: false,
		resolvedActive: false,
		disable: true,
		text: ''
	};

	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal
					style={styles.container}
					visible={this.props.visible}
					onDismiss={() => {
						this.props.onDismiss();
						this.setState({ text: '' });
					}}
				>
					<View style={styles.view}>
						<View style={styles.buttonview}>
							<IconButton
								icon="close-thick"
								iconColor={getCurrentTheme().colors.onBackground}
								size={20}
								onPress={() => {
									this.props.onDismiss();
									this.setState({ text: '' });
								}}
							/>
						</View>
						<Text variant={'bodyLarge'} style={styles.header}>
							Are you sure you want to change the Priority of this?{' '}
						</Text>

						<TextInput
							underlineColor={'#0000000'}
							value={this.state.text}
							onChange={(e) => {
								let text = e.nativeEvent.text;
								this.setState({ text: text });
							}}
							placeholder={'Required'}
							numberOfLines={0}
							multiline={true}
						/>
						{this.state.text.trim().length < 10 ? (this.state.disable = true) : (this.state.disable = false)}
						<View style={styles.textinput}>
							<Button
								onPress={() => {
									this.props.onConfirm(this.state.text);
									this.setState({ text: '' });
								}}
								disabled={this.state.disable}
							>
								Confirm
							</Button>
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
					onConfirm={(text: string) => {
						this.setState({ selectedValue: this.state.selectedButton, visible: false });
						this.props.onPress(this.state.selectedButton, text);
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
	textinput: {
		justifyContent: 'center',
		flexWrap: 'wrap',
		alignItems: 'center',
		flexDirection: 'row'
	},
	header: {
		textAlign: 'center',
		padding: 16,
		paddingTop: 0
	},
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
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'none'
	},
	view: {
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		maxWidth: '80%',
		padding: 16,
		height: 'auto'
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
