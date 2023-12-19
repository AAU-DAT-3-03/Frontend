import React, { Component } from 'react';
import { Button, Checkbox, IconButton, MD3Theme, Modal, Portal, Searchbar, Text } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { IncidentCardHeader } from './incidentCard/IncidentCard';
import Color from 'color';
import { CompanyData, IncidentResponse } from '../utility/DataHandlerTypes';
import DataHandler from '../utility/DataHandler';
import Logger from '../utility/Logger';
import { compareIncident, filterIncidentList } from '../utility/IncidentSort';

interface MergeIncidentProps {
	id: string;
	onMerge: (id: string) => void;
	user: string;
	incident: IncidentResponse;
}

/**
 * Merge incident component for merging incidents
 */
class MergeIncident extends Component<MergeIncidentProps> {
	state = {
		id: this.props.id,
		modalVisible: false
	};

	render(): React.JSX.Element {
		return (
			<View>
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
				{/* Button to trigger the display of the MergeIncidentModal */}
				<Button
					buttonColor={getCurrentTheme().colors.primary}
					textColor={'white'}
					onPress={() => this.setState({ modalVisible: true })}
				>
					Merge with incident
				</Button>
			</View>
		);
	}
}

interface MergeIncidentModalProps {
	visible: boolean;
	onDismiss: (id?: string) => void;
	id: string;
	incident: IncidentResponse;
	user: string;
}

interface MergeIncidentModalState {
	query: string;
	selectedIds: Set<string>;
	incidents: IncidentResponse[];
	refreshing: boolean;
	confirmVisible: boolean;
	merging: boolean;
	mergingCount: number;
	loading: boolean;
}

/**
 * MergeIncidentModal component for modal functionality in merging incidents
 */
class MergeIncidentModal extends Component<MergeIncidentModalProps, MergeIncidentModalState> {
	// Logger instance for logging
	private logger: Logger = new Logger('MergeIncidentScreen');

	state: MergeIncidentModalState = {
		query: '',
		selectedIds: new Set<string>(),
		incidents: [],
		refreshing: false,
		confirmVisible: false,
		merging: false,
		mergingCount: 0,
		loading: true
	};

	// Fetch incidents on component mount
	componentDidMount(): void {
		this.getIncidentResponse();
	}

	/**
	 * Function to handle merging incidents
	 * This function sets the merging state, iteratively merges incidents, and updates the component state accordingly
	 * Finally, it resets the merging state and calls the onDismiss callback with the merged incident's id
	 */
	private async mergeIncidents(): Promise<void> {
		// Set the confirmation modal visibility to false and indicating that merging is in progress
		this.setState({ confirmVisible: false, merging: true });
		let id: string = this.props.id;

		// Iterate through selected incidents for merging
		for (let selectedId of this.state.selectedIds) {
			let data: IncidentResponse | undefined = await DataHandler.mergeIncidents(id, selectedId);
			this.setState({ mergingCount: this.state.mergingCount + 1 });

			// Log an error if merging encounters issues, and skip to the next merge
			if (data === undefined) {
				this.logger.error(`Error occurred while merging incidents: ${id} with ${selectedId}, skipping this merge`);
				continue;
			}

			// Update the id with the merged incident's id
			id = data.id;
		}

		// Reset the merging state and call the onDismiss callback with the final merged incident ID
		this.setState({ merging: false });
		this.props.onDismiss(id);
	}

	/**
	 * Function to handle checkbox selection
	 * If the checkbox is already selected, it is deselected. Otherwise, it is selected
	 * @param {string} id - The identifier of the checkbox.
	 */
	private checkBoxSelector(id: string): void {
		if (this.state.selectedIds.has(id)) {
			let ids: Set<string> = this.state.selectedIds;
			ids.delete(id);
			this.setState({ selectedIds: ids });
		} else {
			this.setState({ selectedIds: this.state.selectedIds.add(id) });
		}
	}

	/**
	 * Function to fetch incident responses for the current company and updates the component state
	 */
	private async getIncidentResponse(): Promise<void> {
		// Initialize an empty array to hold the filtered incidents
		let filteredIncident: IncidentResponse[] = [];

		// Fetch information about the current company
		let companies: CompanyData | undefined = await DataHandler.getCompany(this.props.incident.companyPublic.id);

		if (companies !== undefined) {
			// Get the active incidents for the current company
			let activeCompanyIncidents: Map<string, IncidentResponse> = DataHandler.getIncidentResponseNoUpdate();

			// Iterate through incident references associated with the company
			for (let incidentReference of companies.incidentReferences) {
				// Skip incidents associated with the current incident ID
				if (incidentReference.includes(this.props.id)) continue;
				let incident: IncidentResponse | undefined = activeCompanyIncidents.get(incidentReference);

				// If incident details are available, add it to the filtered incidents array
				if (incident !== undefined) filteredIncident.push(incident);
			}
		}
		// Update the component state with the filtered incidents, and set refreshing and loading states
		this.setState({ incidents: filteredIncident, refreshing: false, loading: false });
	}

	private onRefresh(): void {
		this.setState({ refreshing: true });
		this.getIncidentResponse();
	}

	private getRefreshControl(): React.JSX.Element | undefined {
		return <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;
	}

	/**
	 * Function to render each incident list item
	 */
	private listItemRender(key: number, value: IncidentResponse): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<View style={styleSheet.listItem} key={key}>
				<View style={{ marginTop: 6 }}>
					<Checkbox
						status={this.state.selectedIds.has(value.id) ? 'checked' : 'unchecked'}
						onPress={() => this.checkBoxSelector(value.id)}
					/>
				</View>
				<View style={{ flexShrink: 2 }}>
					<IncidentCardHeader
						collapsed={false}
						onClickButton={undefined}
						onClickIncident={() => this.checkBoxSelector(value.id)}
						incident={value}
					/>
				</View>
			</View>
		);
	}

	/**
	 * Function to render the confirmation modal for merging
	 */
	private confirmMergeRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());
		return (
			<Portal>
				<Modal
					visible={this.state.confirmVisible}
					style={{ alignItems: 'center', justifyContent: 'center' }}
					onDismiss={() => this.setState({ confirmVisible: false })}
				>
					<View style={styleSheet.confirmContainer}>
						<IconButton
							style={styleSheet.closeButton}
							icon={'close-thick'}
							size={20}
							onPress={() => this.setState({ confirmVisible: false })}
						/>
						<Text variant={'titleMedium'}>Are you sure you want to merge?</Text>
						{/* Button for confirming merging and starting MergeIncidents*/}
						<Button
							style={{ width: '100%' }}
							buttonColor={getCurrentTheme().colors.primary}
							textColor={'white'}
							onPress={() => this.mergeIncidents()}
						>
							Merge
						</Button>
					</View>
				</Modal>
			</Portal>
		);
	}

	/**
	 * Renders the content for the merging incident modal.
	 * Handles the UI components and logic for selecting and merging incidents.
	 */
	private mergeSelectorRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<>
				{this.state.loading ? (
					// Display loading indicator if data is still loading
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onSurface} />
				) : (
					<>
						{/* Render the confirmation modal */}
						{this.confirmMergeRender()}
						<View style={styleSheet.modalContainerStyle}>
							{/* Close button to dismiss the modal */}
							<IconButton
								style={styleSheet.closeButton}
								icon={'close-thick'}
								size={20}
								onPress={() => this.props.onDismiss()}
							/>
							<Text variant={'titleLarge'}>Merge incident</Text>
							{/* Searchbar for filtering incidents */}
							<Searchbar
								style={{ backgroundColor: getCurrentTheme().colors.surfaceVariant }}
								inputMode={'text'}
								value={this.state.query}
								onChange={(querystring) => this.setState({ query: querystring.nativeEvent.text })}
							/>

							{/* Display incident list if there are incidents */}
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
											.map((value: IncidentResponse, key: number) => this.listItemRender(key, value))}
									</View>
								</ScrollView>
							) : (
								// Display a message when no active incidents are available
								<View style={styleSheet.noActiveText}>
									<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.outlineVariant }}>
										No Active Incidents
									</Text>
								</View>
							)}
							{/* Merge button to initiate the merging process */}
							<Button
								style={{ width: '100%' }}
								buttonColor={getCurrentTheme().colors.primary}
								textColor={'white'}
								onPress={() => this.setState({ confirmVisible: true })}
							>
								Merge
							</Button>
						</View>
					</>
				)}
			</>
		);
	}

	/**
	 * Renders the content for the currently merging state in the merging incident modal.
	 * Displays a loading indicator and information about the ongoing merging process.
	 */
	private currentlyMergingRender(): React.JSX.Element {
		let styleSheet = style(getCurrentTheme());

		return (
			<View style={styleSheet.modalContainerStyle}>
				<View style={styleSheet.mergingContainer}>
					<Text variant={'titleLarge'}>Merging incidents</Text>
					<ActivityIndicator size={'large'} color={getCurrentTheme().colors.onBackground} />
					<Text variant={'titleMedium'}>
						{this.state.mergingCount}/{this.state.selectedIds.size}
					</Text>
				</View>
			</View>
		);
	}
	/**
	 * Renders the component, displaying a modal that either shows the currently merging state
	 * or the merging selector based on the merging state in the component's state.
	 */
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
			padding: 32,
			paddingTop: 48,
			gap: 16,
			maxWidth: '80%',
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
