import React, { Component } from 'react';
import { Card, Icon, IconButton, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import Color from 'color';
import { getCurrentTheme } from '../themes/ThemeManager';
import ContainerCard from './ContainerCard';

interface NoteCardProps {
	title?: string;
	noteInfo: string;
	onChange: (text: string) => void;
	editable?: boolean;
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

/**
 * Component for the note card
 */
class NoteCard extends Component<NoteCardProps, NoteCardState> {
	state: NoteCardState = {
		editorActive: false,
		text: ''
	};

	// Constructor to set initial state based on props
	constructor(props: NoteCardProps) {
		super(props);
		this.state.text = props.noteInfo;
	}
	render(): React.JSX.Element {
		//let textStyle = { ...noteCardStylesheet.header, borderBottomColor: getCurrentTheme().colors.onSurface };
		return (
			<Card style={noteCardStylesheet.card}>
				<ContainerCard.Header>
					<View style={noteCardStylesheet.header}>
						{this.props.title === 'incident' ? <Text variant={'titleMedium'}>Incident Note</Text> : null}
						{this.props.title === 'alarm' ? <Text variant={'titleMedium'}>Alarm Note</Text> : null}
						{this.props.title === '' ? null : null}
						{/* Shows edit icon if editable prop is true */}
						{this.props.editable === true ? (
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
						) : null}
					</View>
				</ContainerCard.Header>
				{/* Rendering NoteEditor or Text based on editorActive state */}
				{this.state.editorActive ? (
					<NoteEditor
						noteInfo={this.state.text}
						onSave={(text: string) => {
							this.setState({ text: text, editorActive: false });
							this.props.onChange(text);
						}}
					/>
				) : (
					<Text style={noteCardStylesheet.text}>{this.state.text === '' ? 'Note is currently empty' : this.state.text}</Text>
				)}
			</Card>
		);
	}
}

/**
 * The NoteEditor component for editing the note text
 */
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
			// ScrollView to handle keyboard and allow scrolling
			<ScrollView keyboardShouldPersistTaps={'handled'}>
				{/* TextInput for editing note text */}
				<TextInput
					style={noteCardStylesheet.textInput}
					multiline={true}
					defaultValue={this.state.text}
					onChange={(event) => {
						this.setState({ text: event.nativeEvent.text });
					}}
				/>
				{/* Button for saving changes */}
				<IconButton
					icon={'check'}
					size={22}
					style={noteCardStylesheet.viewIcon}
					onPress={() => {
						Keyboard.dismiss();
						this.props.onSave(this.state.text);
					}}
				/>
			</ScrollView>
		);
	}
}

const noteCardStylesheet = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 10
	},
	text: {
		paddingVertical: 20,
		paddingHorizontal: 10
	},
	textInput: {
		marginTop: 25,
		paddingTop: 10
	},
	icon: {
		position: 'absolute',
		right: 10,
		top: 10,
		borderRadius: 10
	},
	viewIcon: {
		flex: 1,
		alignSelf: 'flex-end',
		marginTop: 5
	},
	card: {
		shadowColor: 'transparent',
		paddingTop: 6,
		backgroundColor: getCurrentTheme().colors.elevation.level2
	}
});
export default NoteCard;
