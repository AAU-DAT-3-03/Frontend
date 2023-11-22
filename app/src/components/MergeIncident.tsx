import { Component } from 'react';
import ContainerCard from './ContainerCard';
import { Button, MD3Theme, Modal, Portal, Text } from 'react-native-paper';
import { getCurrentTheme } from '../themes/ThemeManager';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MockDataGenerator } from '../utility/MockDataGenerator';
import { IncidentCardHeader, IncidentType } from './incidentCard/IncidentCard';

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

	render() {
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

class MergeIncidentModal extends Component<MergeIncidentModalProps> {
	private mergeIncidents(id: number): void {
		MockDataGenerator.mergeIncidents(this.props.id, id, this.props.user);
		this.props.onDismiss(true);
	}

	render() {
		let styleSheet = style(getCurrentTheme());
		let currentIncident: IncidentType = MockDataGenerator.getIncident(this.props.id);
		let activeCompanyIncidents: IncidentType[] = MockDataGenerator.getAllIncidents().filter((value) => {
			return value.state !== 'resolved' && value.companyId === currentIncident.companyId && value.id !== currentIncident.id;
		});
		return (
			<Portal>
				<Modal visible={this.props.visible} onDismiss={() => this.props.onDismiss(false)} style={styleSheet.modalStyle}>
					<View style={styleSheet.modalContainerStyle}>
						<Text variant={'titleLarge'}>Merge incident</Text>
						<ScrollView>
							<View style={styleSheet.incidentList}>
								{activeCompanyIncidents.map((value: IncidentType, key: number) => {
									return (
										<IncidentCardHeader
											key={key}
											collapsed={false}
											onClickButton={undefined}
											onClickIncident={() => this.mergeIncidents(value.id)}
											company={value.company}
											case={value.caseNr}
											users={value.assignedUsers}
											status={value.state}
											priority={value.priority}
										/>
									);
								})}
							</View>
						</ScrollView>
					</View>
				</Modal>
			</Portal>
		);
	}
}

const style = (currentTheme: MD3Theme) =>
	StyleSheet.create({
		modalStyle: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			height: '100%'
		},
		modalContainerStyle: {
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 16,
			padding: 16,
			backgroundColor: currentTheme.colors.surface,
			borderRadius: 16,
			maxHeight: '80%'
		},
		incidentList: {
			flexDirection: 'column',
			gap: 16
		}
	});

export default MergeIncident;
