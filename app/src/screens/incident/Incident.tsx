import React, { Component } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import { AppRender, ScreenProps } from '../../../App';
import { ScrollView, StyleSheet, View } from 'react-native';
import PrioritySelector from '../../components/PrioritySelector';
import EventLogCard from '../../components/EventLogCard';
import NoteCard from '../../components/NoteCard';
import AddUser from '../../components/AddUser';
import FABResolved from '../../components/FABResolved';
import { IncidentCardList } from '../../components/incidentCard/IncidentCard';
import { getCurrentTheme } from '../../themes/ThemeManager';
import ContainerCard from '../../components/ContainerCard';
import MergeIncident from '../../components/MergeIncident';
import { IncidentResponse, UpdateIncident, UserResponse } from '../../utility/DataHandlerTypes';
import DataHandler from '../../utility/DataHandler';
import LocalStorage from '../../utility/LocalStorage';
import Logger from '../../utility/Logger';
import Toast from '../../components/Toast';
import LoadingIcon from '../../components/LoadingIcon';
import LoadingScreen from '../../components/LoadingScreen';

interface IncidentState {
	incidentId: string;
	incidentData: IncidentResponse | undefined;
	loading: boolean;
	users: UserResponse[];
	toastMessage: string;
	toastVisible: boolean;
	toastIcon?: string;
	updatingServer: boolean;
}

class Incident extends Component<ScreenProps, IncidentState> {
	// Local username retrieved from LocalStorage
	private userName: string = LocalStorage.getSettingsValue('username');
	// Logger instance for logging
	private logger: Logger = new Logger('IncidentScreen');
	// Timeout for toast dismissal
	private toastTimeout: NodeJS.Timeout | undefined;

	state: IncidentState = {
		incidentId: this.props.route.params?.id ?? '',
		incidentData: undefined,
		loading: true,
		users: [],
		toastMessage: '',
		toastVisible: false,
		toastIcon: undefined,
		updatingServer: false
	};

	/**
	 * Function to load incident data from the server
	 */
	private async loadIncidentResponse(): Promise<void> {
		this.logger.info(`Loading data for: ${this.state.incidentId}`);
		let incidentData: IncidentResponse | undefined = await DataHandler.getIncidentResponse(this.state.incidentId);
		if (incidentData === undefined) {
			this.logger.error('No data received');
			this.setState({ loading: false });
			return;
		}
		this.logger.info(`Rendering data`);

		// Fetching users and updating state
		DataHandler.getUsers().then((value: UserResponse[]) => {
			this.setState({ users: value });
		});

		// Updating state with incident data and setting loading to false
		this.setState({
			incidentData: incidentData,
			loading: false,
			updatingServer: false
		});
	}

	// Method to load incident data on component mount
	componentDidMount(): void {
		requestAnimationFrame(() => {
			setTimeout(() => {
				this.loadIncidentResponse().then(() => this.logger.info(this.state.incidentData));
			}, 0);
		});
	}

	/**
	 * Function to render the AppBar
	 */
	private AppBar(): React.JSX.Element {
		// Formatting date for display
		const formattedDate: string | null = this.state.incidentData
			? new Date(this.state.incidentData.creationDate).toLocaleDateString([], { hour: '2-digit', minute: '2-digit', hour12: false })
			: null;

		return (
			<>
				<View style={IncidentScreenStylesheet.header}>
					<View style={IncidentScreenStylesheet.insideHeader}>
						{/* Back button in the AppBar */}
						<Appbar.BackAction
							onPress={() => {
								this.props.navigation.goBack();
								AppRender.home?.refresh();
								AppRender.history?.refresh();
							}}
						/>
					</View>
					<View style={IncidentScreenStylesheet.insideHeaderCenter}>
						{this.state.loading ? null : (
							<View>
								<Text variant={'titleLarge'}>
									{this.state.incidentData?.companyPublic.name} #{this.state.incidentData?.caseNumber}
								</Text>
							</View>
						)}
					</View>
					<View style={IncidentScreenStylesheet.insideHeader}>
						{/* Formatted date of the incident */}
						<Text>{formattedDate}</Text>
					</View>
				</View>
			</>
		);
	}

	/**
	 * Function to update incident response and trigger a toast message
	 */
	private updateIncidentResponse(data: UpdateIncident, toastText: string, toastIcon?: string): void {
		this.setState({ updatingServer: true });
		DataHandler.updateIncidentResponse(data).then(() => {
			this.toast(toastText, toastIcon);
			this.setState({ updatingServer: false });
			this.loadIncidentResponse();
		});
	}

	/**
	 * Renders the incidents section
	 */
	private incidentsRender(): React.JSX.Element {
		if (this.state.incidentData === undefined) {
			return <Text>Error loading data</Text>;
		}

		// Determines if the incident is editable
		let editable: boolean = !this.state.incidentData.resolved;
		return (
			<View style={{ width: '100%', height: '100%' }}>
				{/* Makes the container for incidents scrollable */}
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={IncidentScreenStylesheet.incidentContainer}>
						{/* AddUser component for assigned users */}
						<AddUser
							editable={editable}
							users={this.state.incidentData?.users}
							type={'Assigned'}
							usersAll={this.state.users}
							removable={true}
							onAdd={(user, name) => {
								this.updateIncidentResponse(
									{ id: this.state.incidentId, addUsers: [user] },
									`${name} has been assigned`,
									'account'
								);
							}}
							onRemove={(user, name) =>
								this.updateIncidentResponse(
									{ id: this.state.incidentId, removeUsers: [user] },
									`${name} has been removed`,
									'account'
								)
							}
						/>
						{/* PrioritySelector component for setting incident priority */}
						<PrioritySelector
							editable={editable}
							state={this.state.incidentData?.priority}
							onPress={(value: number, text: string) =>
								this.updateIncidentResponse(
									{ id: this.state.incidentId, priority: value, priorityNote: text },
									`Priority has been set to ${value}`,
									'clipboard-list-outline'
								)
							}
						/>
						{/* AddUser component for called users */}
						<AddUser
							editable={editable}
							users={this.state.incidentData?.calls}
							type={'Called'}
							usersAll={this.state.users}
							removable={false}
							onAdd={(user, name) =>
								this.updateIncidentResponse(
									{ id: this.state.incidentId, addCalls: [user] },
									`${name} has been called`,
									'account'
								)
							}
						/>
						<ContainerCard style={{ paddingBottom: 0 }}>
							<ContainerCard.Content>
								<Text variant={'titleMedium'} style={IncidentScreenStylesheet.text}>
									Alarms
								</Text>
								{/* IncidentCardList for displaying alarms */}
								<IncidentCardList
									alarms={this.state.incidentData?.alarms}
									onClickAlarm={(id, alarm) => this.props.navigation.navigate('Alarm', { id: id, alarm: alarm })}
								/>
							</ContainerCard.Content>
						</ContainerCard>
						{/* NoteCard component for incident notes */}
						<NoteCard
							title={'incident'}
							editable={editable}
							noteInfo={this.state.incidentData?.incidentNote}
							// Update incident response when incident note is changed
							onChange={(text) =>
								this.updateIncidentResponse(
									{ id: this.state.incidentId, incidentNote: text },
									`Note has been updated to: ${text.slice(0, Math.min(text.length, 10))}${text.length > 10 ? '...' : ''}`,
									'note-outline'
								)
							}
						/>
						{editable ? (
							<ContainerCard>
								<View
									style={{
										flexDirection: 'row',
										flexWrap: 'nowrap',
										gap: 16,
										width: '100%',
										paddingHorizontal: 16,
										justifyContent: 'space-evenly'
									}}
								>
									<View style={{ flexGrow: 2 }}>
										{/* MergeIncident component */}
										<MergeIncident
											incident={this.state.incidentData}
											user={this.userName}
											id={this.state.incidentId}
											onMerge={(id: string): void => {
												this.toast('Incident(s) merged', 'merge');
												this.setState({ incidentId: id, updatingServer: true }, () => this.loadIncidentResponse());
											}}
										/>
									</View>
									<View style={{ flexGrow: 2 }}>
										{/* FABResolved component for resolving incidents */}
										<FABResolved
											// Update incident response when resolving the incident
											onResolve={() => {
												this.updateIncidentResponse(
													{ id: this.state.incidentId, resolved: true },
													'Incident has been resolved',
													'check'
												);
											}}
										/>
									</View>
								</View>
							</ContainerCard>
						) : null}
						{/* Display EventLogCard if event log exists */}
						{this.state.incidentData.eventLog !== undefined ? (
							<EventLogCard eventLog={this.state.incidentData?.eventLog} />
						) : null}
					</View>
				</ScrollView>
			</View>
		);
	}

	/**
	 * Function to display a toast message with an optional icon
	 * @param {string} text - The text message to be displayed in the toast
	 * @param {string} icon - Optional icon to be displayed alongside the text
	 */
	private toast(text: string, icon?: string) {
		// Set state to show the toast with the provided message and icon
		this.setState({ toastVisible: true, toastIcon: icon, toastMessage: text });
		// Set a timeout to hide the toast after 3000 milliseconds (3 seconds)
		this.toastTimeout = setTimeout(() => {
			this.setState({ toastVisible: false });
		}, 3000);
	}

	/**
	 * Function to handle the dismissal of the toast
	 */
	private toastOnDismiss() {
		// Clear the timeout to prevent hiding the toast if it is manually dismissed
		clearTimeout(this.toastTimeout);
		this.toastTimeout = undefined;
		// Set state to hide the toast
		this.setState({ toastVisible: false });
	}

	/**
	 * Render function for the Incident component
	 */
	render(): React.JSX.Element {
		return (
			<View>
				{/* Toast component to display messages */}
				<Toast
					message={this.state.toastMessage}
					visible={this.state.toastVisible}
					onDismiss={() => this.toastOnDismiss()}
					icon={this.state.toastIcon}
				/>
				{/* LoadingIcon component to show loading spinner */}
				<LoadingIcon visible={this.state.updatingServer} verticalOffset={60} />
				<ContentContainer
					appBar={this.AppBar()}
					// Refresh incident data
					onRefresh={async (finished) => {
						await this.loadIncidentResponse();
						finished();
					}}
				>
					{/* Display loading screen if data is still loading, otherwise render incident details */}
					{this.state.loading ? <LoadingScreen /> : this.incidentsRender()}
				</ContentContainer>
			</View>
		);
	}
}

const IncidentScreenStylesheet = StyleSheet.create({
	incidentContainer: {
		padding: 16,
		flexDirection: 'column',
		gap: 16
	},
	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center'
	},
	insideHeader: {
		width: '25%'
	},
	insideHeaderCenter: {
		width: '50%',
		alignItems: 'center'
	},
	card: {
		borderRadius: 16,
		paddingTop: 15,
		backgroundColor: getCurrentTheme().colors.elevation.level2
	},
	text: {
		alignSelf: 'center',
		paddingBottom: 8
	}
});

export default Incident;
