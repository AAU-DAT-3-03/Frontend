import React, { Component } from 'react';
import { Card, Icon, IconButton, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Color from 'color';
import { getCurrentTheme } from '../themes/ThemeManager';

interface NoteCardProps {
	noteInfo: string;
}
interface NoteEditorProps {
	noteInfo: string;
	onSave: (text: string) => void;
}
interface NoteCardState {
	editorActive: boolean;
	text: string;
}
interface NoteEditorState {
	text: string;
}

class NoteCard extends Component<NoteCardProps, NoteCardState> {
	state: NoteCardState = {
		editorActive: false,
		text: ''
	};
	constructor(props: NoteCardProps) {
		super(props);
		this.state.text = props.noteInfo;
	}
	render(): React.JSX.Element {
		let textStyle = { ...noteCardStylesheet.header, borderBottomColor: getCurrentTheme().colors.onSurface };
		return (
			<Card>
				<Card.Content>
					<View style={textStyle}>
						<Text>Incident Note</Text>
						<TouchableRipple
							style={noteCardStylesheet.icon}
							rippleColor={Color(getCurrentTheme().colors.onSurface).alpha(0.3).toString()}
							borderless={true}
							onPress={() => {
								this.setState({ editorActive: true });
							}}
						>
							<Icon source={'pencil'} size={22} />
						</TouchableRipple>
					</View>
					{this.state.editorActive === true ? (
						<NoteEditor
							noteInfo={this.state.text}
							onSave={(text: string) => {
								this.setState({ text: text, editorActive: false });
							}}
						></NoteEditor>
					) : (
						<Text style={noteCardStylesheet.text}>{this.state.text}</Text>
					)}
				</Card.Content>
			</Card>
		);
	}
}

class NoteEditor extends Component<NoteEditorProps, NoteEditorState> {
	state: NoteEditorState = {
		text: ''
	};
	constructor(props: NoteEditorProps) {
		super(props);
		this.state.text = props.noteInfo;
	}
	render(): React.JSX.Element {
		return (
			<View>
				<TextInput
					style={noteCardStylesheet.textInput}
					multiline={true}
					defaultValue={this.state.text}
					onChange={(event) => {
						this.setState({ text: event.nativeEvent.text });
					}}
				/>
				<IconButton
					icon={'check'}
					size={22}
					style={noteCardStylesheet.viewIcon}
					onPress={() => {
						this.props.onSave(this.state.text);
					}}
				/>
			</View>
		);
	}
}

const noteCardStylesheet = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		borderBottomWidth: 0.5,
		paddingBottom: 10
	},
	text: {
		paddingTop: 25,
		paddingBottom: 10
	},
	textInput: {
		marginTop: 25,
		paddingTop: 10
	},
	icon: {
		position: 'absolute',
		top: 0,
		right: 5,
		borderRadius: 10
	},
	viewIcon: {
		flex: 1,
		alignSelf: 'flex-end',
		margin: 0,
		marginTop: 5
	}
});
export default NoteCard;
