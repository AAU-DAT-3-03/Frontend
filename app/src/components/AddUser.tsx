import React, { Component } from 'react';
import { Card, IconButton, Portal, Text, Modal, Searchbar } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	view: {
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.surface,
		width: 256,
		height: 512
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	}
});

enum Status {
	ASSIGNED,
	CALLED
}

interface AssignUserProps {
	visible: boolean;
	onDismiss: () => void;
}

class AssignUser extends Component<AssignUserProps, Status> {
	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss()}>
					<View style={styles.view}>
						<Searchbar placeholder={'User'} mode={'view'} icon={'account'} showDivider={true} />
					</View>
				</Modal>
			</Portal>
		);
	}
}

interface AddUserProps {
	type: string;
}

class AddUser extends Component<AddUserProps> {
	state = { assignVisible: false };

	render(): React.JSX.Element {
		return (
			<Card
				style={{
					backgroundColor: getCurrentTheme().colors.surface,
					borderWidth: 1,
					borderColor: 'grey',
					height: 45
				}}
			>
				<Card.Content
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingRight: 0,
						paddingTop: 0,
						paddingBottom: 0,
						height: '100%'
					}}
				>
					<Text
						style={{
							color: getCurrentTheme().colors.onSurface
						}}
					>
						{this.props.type}
					</Text>

					<IconButton
						icon="plus-circle"
						iconColor={getCurrentTheme().colors.primary}
						size={30}
						onPress={() => this.setState({ assignVisible: true })}
						style={{}}
					/>
					<AssignUser
						visible={this.state.assignVisible}
						onDismiss={() => {
							this.setState({ assignVisible: false });
						}}
					></AssignUser>
				</Card.Content>
			</Card>
		);
	}
}

export default AddUser;
