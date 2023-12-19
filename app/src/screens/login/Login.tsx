import React, { Component } from 'react';
import ContentContainer from '../../components/ContentContainer';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors, getCurrentTheme } from '../../themes/ThemeManager';
import NeticLogo from '../../assets/NeticLogo';
import DataHandler from '../../utility/DataHandler';
import Color from 'color';
import Networking from '../../utility/Networking';

interface LoginProps {
	onLoggedIn: () => void;
}

/**
 * Login component for user authentication
 */
class Login extends Component<LoginProps> {
	state = {
		email: '',
		password: '',
		error: false,
		debug: false,
		debugText: undefined,
		debugTestText: undefined
	};

	/**
	 * Function that handles the login process, validating user input and triggering the login operation
	 */
	private handleLogin(): void {
		// Check if email or password is empty, which will set the error state to true and exit the function
		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: true });
			return;
		}

		// Clear any previous error state
		this.setState({ error: false });
		// Attempt to login using the provided credentials
		DataHandler.login(this.state.email.toLowerCase(), this.state.password).then((value: [boolean, object]) => {
			// Check if the login was successful
			if (value[0] === true) {
				// Call the onLoggedIn to notify that the user has successfully logged in
				this.props.onLoggedIn();
			} else {
				// Set error state to true if login failed
				this.setState({ error: true });
			}
			// Store debug text for reference
			this.setState({ debugText: value });
		});
	}

	/**
	 * Renders the login screen component
	 * The screen includes a logo, email and password input fields, a login button,
	 * and options for displaying debug information
	 */
	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={undefined}>
				<View style={loginStyle().wrapper}>
					{/* Logo section */}
					<View style={loginStyle().logo}>
						<NeticLogo />
					</View>
					{/* Login form section */}
					<View style={loginStyle().containerCard}>
						<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.onSurface, alignSelf: 'center' }}>
							Login
						</Text>
						{/* Display error message if login credentials are invalid */}
						{this.state.error ? <Text style={{ color: Colors.error, alignSelf: 'center' }}>Credentials not valid</Text> : null}
						{/* Email input field */}
						<TextInput
							defaultValue={this.state.email}
							placeholder={'Email'}
							style={{
								backgroundColor: getCurrentTheme().colors.background,
								color: getCurrentTheme().colors.onSurface,
								paddingHorizontal: 8
							}}
							autoCapitalize={'none'}
							underlineColorAndroid={Colors.error}
							onChangeText={(text: string): void => {
								this.setState({ email: text });
							}}
							inputMode={'email'}
							textContentType={'emailAddress'}
						/>
						{/* Password input field */}
						<TextInput
							defaultValue={this.state.password}
							placeholder={'Password'}
							style={{
								backgroundColor: getCurrentTheme().colors.background,
								color: getCurrentTheme().colors.onSurface,
								paddingHorizontal: 8
							}}
							underlineColorAndroid={Colors.error}
							autoCapitalize={'none'}
							onChangeText={(text: string) => {
								this.setState({ password: text });
							}}
							inputMode={'text'}
							secureTextEntry={true}
							textContentType={'password'}
						/>
						{/* Login Button */}
						<Button buttonColor={Colors.error} textColor={'white'} onPress={() => this.handleLogin()}>
							Login
						</Button>
					</View>
				</View>
				{/* Debug information Modal */}
				<Portal>
					<Modal visible={this.state.debug} onDismiss={() => this.setState({ debug: false })}>
						<View style={{ backgroundColor: getCurrentTheme().colors.surface }}>
							<Text>Debug info</Text>
							<Text>{DataHandler.ip}</Text>
							<Text>{JSON.stringify(this.state.debugText)}</Text>
							<Text>{JSON.stringify(this.state.debugTestText)}</Text>
							{/* Test Connection Button */}
							<Button onPress={() => this.testConnection()}>Test</Button>
						</View>
					</Modal>
				</Portal>
				{/* Debug toggle Button */}
				<Button
					style={{ position: 'absolute', top: 5, right: 5, padding: 16 }}
					buttonColor={getCurrentTheme().colors.background}
					textColor={Color(getCurrentTheme().colors.primary).alpha(0.1).toString()}
					onPress={() => this.setState({ debug: true })}
				>
					i
				</Button>
			</ContentContainer>
		);
	}

	/**
	 * Initiates a network test connection to the server's IP.
	 * Creates an instance of a `Networking` class, then performs a GET request to the server's IP,
	 * and updates the component's state with the debug test result
	 */
	private testConnection(): void {
		let networking: Networking = new Networking();
		networking.get(DataHandler.ip, undefined, (value: void | [object, Response]): void => {
			if (value) {
				this.setState({ debugTestText: value });
			}
		});
	}
}

const loginStyle = () => {
	return StyleSheet.create({
		logo: {
			margin: 0,
			width: '50%',
			aspectRatio: 1,
			alignItems: 'center',
			justifyContent: 'center'
		},
		wrapper: {
			gap: 1,
			padding: 32,
			paddingVertical: 128,
			flexDirection: 'column',
			height: '100%',
			width: '100%',
			alignItems: 'center'
		},
		containerCard: {
			margin: 0,
			borderRadius: 16,
			width: '100%',
			backgroundColor: getCurrentTheme().colors.background,
			padding: 32,
			flexDirection: 'column',
			justifyContent: 'center',
			gap: 16
		}
	});
};

export default Login;
