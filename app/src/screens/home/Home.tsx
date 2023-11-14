import React, { Component, lazy } from 'react';
import { Appbar, Text } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import IncidentCard, { Incident } from '../../components/incidentCard/IncidentCard';
import { getCurrentTheme } from '../../themes/ThemeManager';

const incident: Incident = {
	state: 'acknowledged',
	alarms: [
		{ alarmError: 'Crashed 4 times', id: 1 },
		{ alarmError: 'OOM Killed', id: 2 },
		{ alarmError: 'Restarted', id: 3 }
	],
	caseNr: 1027,
	company: 'Jysk',
	users: [
		{ name: 'Bent', phoneNr: 12345678 },
		{ name: 'Ole', phoneNr: 12345678 },
		{ name: 'Rasmus', phoneNr: 12345678 }
	],
	priority: 4
};

class Home extends Component {
	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.Content title={'Home'} />
			</Appbar>
		);
	}

	private onRefresh(finished: () => void): void {
		setTimeout(() => finished(), 5000);
	}

	render(): React.JSX.Element {
		let theme: any = getCurrentTheme();
		return (
			<ContentContainer appBar={this.AppBar()} onRefresh={this.onRefresh}>
				<Text style={{ color: theme.colors.tertiary }} variant={'displayLarge'}>
					test
				</Text>
				<IncidentCard
					incident={incident}
					onClickIncident={(id) => console.log('Incident', id)}
					onClickAlarm={(id) => console.log('Alarm', id)}
				/>
			</ContentContainer>
		);
	}
}

export default Home;
