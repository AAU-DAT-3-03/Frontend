import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { getCurrentTheme } from '../../themes/ThemeManager';
import { UserResponse } from '../../utility/DataHandlerTypes';
import React, { Component } from 'react';
import { Icon, Modal, Portal, Searchbar, Text, TouchableRipple } from 'react-native-paper';

interface AssignUserProps {
	users: UserResponse[];
	visible: boolean;
	onDismiss: (user: UserResponse | undefined) => void;
}

class AssignUser extends Component<AssignUserProps> {
	state = {
		query: ''
	};

	render(): React.JSX.Element {
		return (
			<Portal>
				<Modal style={styles.container} visible={this.props.visible} onDismiss={() => this.props.onDismiss(undefined)}>
					<View style={styles.view}>
						<View style={{ width: '100%', backgroundColor: getCurrentTheme().colors.elevation.level4 }}>
							<Searchbar
								style={styles.searchbar}
								placeholder={'Search User'}
								icon={'account-search'}
								showDivider={true}
								value={this.state.query}
								traileringIcon={'close'}
								onTraileringIconPress={() => this.props.onDismiss(undefined)}
								onChange={(e) => this.setState({ query: e.nativeEvent.text })}
							/>
						</View>

						<FlatList
							style={{ width: '100%' }}
							data={this.props.users
								.filter(
									(value) =>
										value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 ||
										(value.team !== undefined &&
											value.team.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1)
								)
								.sort((user1, user2) => user1.name.localeCompare(user2.name))}
							renderItem={(info) => {
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
	}
});

export default AssignUser;
