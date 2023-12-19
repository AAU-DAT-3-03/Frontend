// Importing libraries and components.
import { Dimensions, FlatList, ListRenderItemInfo, NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { UserResponse } from '../../utility/DataHandlerTypes';
import React, { Component } from 'react';
import { Icon, Modal, Portal, Searchbar, Text, TouchableRipple } from 'react-native-paper';

/**
 * @brief Defines the props for the AssignUser component.
 */
interface AssignUserProps {
	users: UserResponse[];
	visible: boolean;
	onDismiss: (user: UserResponse | undefined) => void;
}

interface AssignUserState {
	query: string;
}

/**
 * @brief A class component that allows assigning a user.
 * @details This component displays a list of users in a modal and allows selecting a user to assign.
 */
class AssignUser extends Component<AssignUserProps, AssignUserState> {
	state: AssignUserState = {
		query: ''
	};

	/**
	 * @brief Renders the component.
	 * @return {React.JSX.Element} - The rendered AssignUser component.
	 */
	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss(undefined)}>
					<View style={styles.view}>
						<View style={styles.searchbarWrapper}>
							<Searchbar
								style={styles.searchbar}
								placeholder={'Search User'}
								icon={'account-search'}
								showDivider={true}
								value={this.state.query}
								traileringIcon={'close'}
								onTraileringIconPress={() => this.props.onDismiss(undefined)}
								onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
									this.setState({ query: e.nativeEvent.text })
								}
							/>
						</View>

						<FlatList
							style={styles.fullWidth}
							data={this.props.users
								.filter(
									(value: UserResponse) =>
										value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 ||
										(value.team !== undefined &&
											value.team.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1)
								)
								.sort((user1: UserResponse, user2: UserResponse) => user1.name.localeCompare(user2.name))}
							renderItem={(info: ListRenderItemInfo<UserResponse>) => {
								return (
									<TouchableRipple onPress={() => this.props.onDismiss(info.item)}>
										<View style={styles.buttons}>
											<View style={styles.icon}>
												<Icon size={22} source={'account'} />
											</View>
											<Text>
												{info.item.name} - {info.item.team}
											</Text>
										</View>
									</TouchableRipple>
								);
							}}
						/>
					</View>
				</Modal>
			</Portal>
		);
	}
}

/**
 * @brief Styles for the AssignUser component.
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: undefined,
		position: 'absolute'
	},
	view: {
		flexDirection: 'column',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: getCurrentTheme().colors.elevation.level2,
		maxWidth: '80%',
		height: Dimensions.get('window').height - 150
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	},
	buttons: {
		flexDirection: 'row',
		textAlign: 'left',
		padding: 0,
		margin: 0,
		width: '100%',
		paddingVertical: 8,
		alignItems: 'center',
		paddingHorizontal: 4
	},
	icon: {
		padding: 2,
		marginLeft: 6
	},
	searchbar: {
		maxWidth: '100%',
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
		backgroundColor: getCurrentTheme().colors.elevation.level4
	},
	searchbarWrapper: {
		width: '100%',
		backgroundColor: getCurrentTheme().colors.elevation.level4
	},
	fullWidth: {
		width: '100%'
	}
});

export default AssignUser;
