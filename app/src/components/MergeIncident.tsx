import React, { Component } from 'react';
import ContainerCard from './ContainerCard';
import { Button, Checkbox, IconButton, MD3Theme, Modal, Portal, Searchbar, Text } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { IncidentCardHeader } from './incidentCard/IncidentCard';
import { compareIncident, filterIncidentList } from '../screens/home/Home';
import Color from 'color';
import { CompanyData, IncidentData } from '../utility/DataHandlerTypes';
import DataHandler from '../utility/DataHandler';
import Logger from '../utility/Logger';

interface MergeIncidentProps {
	id: string;
	onMerge: (id: string) => void;
	user: string;
	incident: IncidentData;
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
					onDismiss={(id: string | undefined): void => {
						if (id !== undefined) this.props.onMerge(id);
						this.setState({ modalVisible: false });
					}}
					incident={this.props.incident}
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
	onDismiss: (id?: string) => void;
	id: string;
	incident: IncidentData;
	user: string;
}

interface MergeIncidentModalState {
	query: string;
	selectedIds: Set<string>;
	incidents: IncidentData[];
	refreshing: boolean;
	confirmVisible: boolean;
	merging: boolean;
	mergingCount: number;
}

class MergeIncidentModal extends Component<MergeIncidentModalProps, MergeIncidentModalState> {
	private logger: Logger = new Logger('MergeIncidentScreen');

	state: MergeIncidentModalState = {
		query: '',
		selectedIds: new Set<string>(),
		incidents: [],
		refreshing: false,
		confirmVisible: false,
		merging: false,
		mergingCount: 0
	};

	componentDidMount(): void {
		this.getIncidentData();
	}

	/**
	 * @todo Make de mergings work
	 * @private
	 */
	private async mergeIncidents(): Promise<void> {
		this.setState({ confirmVisible: false, merging: true });
		let id: string = this.props.id;
		for (let selectedId of this.state.selectedIds) {
			let data: IncidentData | undefined = await DataHandler.mergeIncidents(id, selectedId);
			this.setState({ mergingCount: this.state.mergingCount + 1 });
			if (data === undefined) {
				this.logger.error(`Error occurred while merging incidents: ${id} with ${selectedId}, skipping this merge`);
				continue;
			}
			id = data.id;
		}
		this.setState({ merging: false });
		this.props.onDismiss(id);
	}

	private checkBoxSelector(id: string): void {
		if (this.state.selectedIds.has(id)) {
			let ids: Set<string> = this.state.selectedIds;
			ids.delete(id);
			this.setState({ selectedIds: ids });
		} else {
			this.setState({ selectedIds: this.state.selectedIds.add(id) });
		}
	}

	private async getIncidentData(): Promise<void> {
		let filteredIncident: IncidentData[] = [];
		let companies: CompanyData | undefined = await DataHandler.getCompany(this.props.incident.companyId);
		if (companies !== undefined) {
			let activeCompanyIncidents: Map<string, IncidentData> = DataHandler.getIncidentDataNoUpdate();
			for (let incidentReference of companies.incidentReferences) {
				let incident: IncidentData | undefined = activeCompanyIncidents.get(incidentReference);
				if (incident !== undefined) filteredIncident.push(incident);
			}
		}
		this.setState({ incidents: filteredIncident, refreshing: false });
	}

	private onRefresh(): void {
		this.setState({ refreshing: true });
		this.getIncidentData();
	}

	private getRefreshControl(): React.JSX.Element | undefined {
		return <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;
	}

	private listItemRender(key: number, value: IncidentData): React.JSX.Element {
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
					incident={value}
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

	private mergeSelectorRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<>
				{this.confirmMergeRender()}
				<View style={styleSheet.modalContainerStyle}>
					<IconButton style={styleSheet.closeButton} icon={'close-thick'} size={20} onPress={() => this.props.onDismiss()} />
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
									.map((value: IncidentData, key: number) => this.listItemRender(key, value))}
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
			</>
		);
	}

	private currentlyMergingRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<View style={styleSheet.modalContainerStyle}>
				<View style={styleSheet.mergingContainer}>
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					<Text>
						{this.state.mergingCount}/{this.state.selectedIds.size}
					</Text>
				</View>
			</View>
		);
	}

	render(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());
		return (
			<Portal>
				<Modal visible={this.props.visible} onDismiss={() => this.props.onDismiss()} style={styleSheet.modalStyle}>
					{this.state.merging ? this.currentlyMergingRender() : this.mergeSelectorRender()}
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
		},
		mergingContainer: {
			flexDirection: 'column',
			gap: 16,
			justifyContent: 'center',
			alignItems: 'center'
		}
	});

export default MergeIncident;
