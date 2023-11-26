import React, { Component } from 'react';
import ContainerCard from './ContainerCard';
import { Button, Checkbox, IconButton, MD3Theme, Modal, Portal, Searchbar, Text } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { MockDataGenerator } from '../utility/MockDataGenerator';
import { IncidentCardHeader, IncidentType } from './incidentCard/IncidentCard';
import { compareIncident, filterIncidentList } from '../screens/home/Home';
import Color from 'color';

interface MergeIncidentProps {
	id: number;
	onMerge: () => void;
	user: string;
}

class MergeIncident extends Component<MergeIncidentProps> {
	state = {
		id: this.props.id,
		modalVisible: false
	};

	render(): React.JSX.Element {
		return (
			<ContainerCard>
				<MergeIncidentModal
					user={this.props.user}
					visible={this.state.modalVisible}
					id={this.state.id}
					onDismiss={(merged) => {
						if (merged) this.props.onMerge();
						this.setState({ modalVisible: false });
					}}
				/>
				<ContainerCard.Content>
					<Button
						style={{ marginHorizontal: 16 }}
						buttonColor={getCurrentTheme().colors.primary}
						textColor={'white'}
						onPress={() => this.setState({ modalVisible: true })}
					>
						Merge with incident
					</Button>
				</ContainerCard.Content>
			</ContainerCard>
		);
	}
}

interface MergeIncidentModalProps {
	visible: boolean;
	onDismiss: (merged: boolean) => void;
	id: number;
	user: string;
}

interface MergeIncidentModalState {
	query: string;
	selectedIds: Set<number>;
	incidents: IncidentType[];
	refreshing: boolean;
	confirmVisible: boolean;
}

class MergeIncidentModal extends Component<MergeIncidentModalProps, MergeIncidentModalState> {
	state: MergeIncidentModalState = {
		query: '',
		selectedIds: new Set<number>(),
		incidents: [],
		refreshing: false,
		confirmVisible: false
	};

	componentDidMount(): void {
		this.getIncidentData();
	}

	private mergeIncidents(): void {
		this.setState({ confirmVisible: false });
		for (let id of this.state.selectedIds) {
			MockDataGenerator.mergeIncidents(this.props.id, id, this.props.user);
		}
		this.props.onDismiss(true);
	}

	private checkBoxSelector(id: number): void {
		if (this.state.selectedIds.has(id)) {
			let ids: Set<number> = this.state.selectedIds;
			ids.delete(id);
			this.setState({ selectedIds: ids });
		} else {
			this.setState({ selectedIds: this.state.selectedIds.add(id) });
		}
	}

	private getIncidentData(): void {
		let currentIncident: IncidentType = MockDataGenerator.getIncident(this.props.id);
		let activeCompanyIncidents: IncidentType[] = MockDataGenerator.getAllIncidents().filter((value) => {
			return value.state !== 'resolved' && value.companyId === currentIncident.companyId && value.id !== currentIncident.id;
		});
		this.setState({ incidents: activeCompanyIncidents, refreshing: false });
	}

	private onRefresh(): void {
		this.setState({ refreshing: true });
		this.getIncidentData();
	}

	private getRefreshControl(): React.JSX.Element | undefined {
		return <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;
	}

	private listItemRender(key: number, value: IncidentType): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<View style={styleSheet.listItem} key={key}>
				<View style={{ marginTop: 6 }}>
					<Checkbox
						status={this.state.selectedIds.has(value.id) ? 'checked' : 'unchecked'}
						onPress={() => this.checkBoxSelector(value.id)}
					/>
				</View>
				<IncidentCardHeader
					collapsed={false}
					onClickButton={undefined}
					onClickIncident={() => this.checkBoxSelector(value.id)}
					company={value.company}
					case={value.caseNr}
					users={value.assignedUsers}
					status={value.state}
					priority={value.priority}
				/>
			</View>
		);
	}

	private confirmMergeRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());
		return (
			<Portal>
				<Modal visible={this.state.confirmVisible} style={{ alignItems: 'center', justifyContent: 'center' }}>
					<View style={styleSheet.confirmContainer}>
						<Text variant={'titleMedium'}>Are you sure you want to merge?</Text>
						<Button
							style={{ width: '100%' }}
							buttonColor={getCurrentTheme().colors.primary}
							onPress={() => this.mergeIncidents()}
						>
							Merge
						</Button>
					</View>
				</Modal>
			</Portal>
		);
	}

	render() {
		let styleSheet = style(getCurrentTheme());
		return (
			<Portal>
				<Modal visible={this.props.visible} onDismiss={() => this.props.onDismiss(false)} style={styleSheet.modalStyle}>
					{this.confirmMergeRender()}
					<View style={styleSheet.modalContainerStyle}>
						<IconButton
							style={styleSheet.closeButton}
							icon={'close-thick'}
							size={20}
							onPress={() => this.props.onDismiss(false)}
						/>
						<Text variant={'titleLarge'}>Merge incident</Text>
						<Searchbar
							style={{ backgroundColor: getCurrentTheme().colors.surfaceVariant }}
							inputMode={'text'}
							value={this.state.query}
							onChange={(querystring) => this.setState({ query: querystring.nativeEvent.text })}
						/>

						{this.state.incidents.length > 0 ? (
							<ScrollView
								style={{ width: '100%', height: '100%' }}
								showsVerticalScrollIndicator={false}
								refreshControl={this.getRefreshControl()}
							>
								<View style={styleSheet.incidentList}>
									{this.state.incidents
										.filter((incident) => filterIncidentList(incident, this.state.query))
										.sort(compareIncident)
										.map((value: IncidentType, key: number) => this.listItemRender(key, value))}
								</View>
							</ScrollView>
						) : (
							<View style={styleSheet.noActiveText}>
								<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.outlineVariant }}>
									No Active Incidents
								</Text>
							</View>
						)}
						<Button
							style={{ width: '100%' }}
							buttonColor={getCurrentTheme().colors.primary}
							onPress={() => this.setState({ confirmVisible: true })}
						>
							Merge
						</Button>
					</View>
				</Modal>
			</Portal>
		);
	}
}

const style = (currentTheme: MD3Theme) =>
	StyleSheet.create({
		modalStyle: {
			margin: 0,
			padding: 0,
			width: '100%',
			height: '100%'
		},
		modalContainerStyle: {
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: currentTheme.colors.surface,
			margin: 0,
			gap: 16,
			padding: 16,
			width: '100%',
			height: '100%'
		},
		incidentList: {
			width: '100%',
			flexDirection: 'column',
			gap: 16
		},
		closeButton: {
			position: 'absolute',
			top: 8,
			right: 16
		},
		listItem: {
			borderRadius: 16,
			backgroundColor: Color(currentTheme.colors.onSurface).alpha(0.05).toString(),
			padding: 12,
			paddingBottom: 14,
			paddingTop: 8,
			flexDirection: 'row',
			gap: 8,
			flexWrap: 'nowrap',
			width: '100%',
			alignItems: 'center'
		},
		noActiveText: {
			flexGrow: 2,
			width: '100%',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		},
		confirmContainer: {
			flexDirection: 'column',
			backgroundColor: currentTheme.colors.surface,
			padding: 16,
			gap: 16,
			maxWidth: '70%',
			borderRadius: 16
		}
	});

export default MergeIncident;
