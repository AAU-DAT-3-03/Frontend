import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import InformationCard from '../../components/InformationCard';
import NoteCard from '../../components/NoteCard';

interface AlarmProps {
	alarm: string;
	alarmError: string;
	alarmLog: string;
	alarmNote: string;
	service: string;
}

class AlarmInfo {
	get service(): string {
		return this._service as string;
	}

	set service(value: string) {
		this._service = value;
	}

	get alarmNote(): string {
		return this._alarmNote as string;
	}

	set alarmNote(value: string) {
		this._alarmNote = value;
	}

	get alarmLog(): string {
		return this._alarmLog as string;
	}

	set alarmLog(value: string) {
		this._alarmLog = value;
	}

	get alarmError(): string {
		return this._alarmError as string;
	}

	set alarmError(value: string) {
		this._alarmError = value;
	}

	private _alarmError: string | undefined;
	private _alarmLog: string | undefined;
	private _alarmNote: string | undefined;
	private _service: string | undefined;
}
interface AlarmState {
	alarm: string;
}

class Alarm extends Component<AlarmProps, AlarmState, AlarmInfo> {
	state: AlarmState = {
		alarm: 'Not defined'
	};
	constructor(props: AlarmProps) {
		super(props);
		this.state.alarm = props.alarm;
	}

	private AppBar(): React.JSX.Element {
		return (
			<Appbar>
				<Appbar.BackAction onPress={() => {}} />
				<Appbar.Content title={this.state.alarm} />
			</Appbar>
		);
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={this.AppBar()}>
				<InformationCard errorType={this.state.alarm} errorInfo={this.props.alarmLog}></InformationCard>
				<NoteCard noteInfo={this.props.alarmNote} onChange={() => {}}></NoteCard>
			</ContentContainer>
		);
	}
}

export default Alarm;
