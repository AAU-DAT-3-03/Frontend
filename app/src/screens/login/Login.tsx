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
 * @todo slet login imformation
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

	private handleLogin(): void {
		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: true });
			return;
		}
		this.setState({ error: false });
		DataHandler.login(this.state.email.toLowerCase(), this.state.password).then((value: [boolean, object]) => {
			if (value[0] === true) {
				this.props.onLoggedIn();
			} else {
				this.setState({ error: true });
			}
			this.setState({ debugText: value });
		});
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer appBar={undefined}>
				<View style={loginStyle().wrapper}>
					<View style={loginStyle().logo}>
						<NeticLogo />
					</View>
					<View style={loginStyle().containerCard}>
						<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.onSurface, alignSelf: 'center' }}>
							Login
						</Text>
						{this.state.error ? <Text style={{ color: Colors.error, alignSelf: 'center' }}>Credentials not valid</Text> : null}
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
						<Button buttonColor={Colors.error} textColor={'white'} onPress={() => this.handleLogin()}>
							Login
						</Button>
					</View>
				</View>
				<Portal>
					<Modal visible={this.state.debug} onDismiss={() => this.setState({ debug: false })}>
						<View style={{ backgroundColor: getCurrentTheme().colors.surface }}>
							<Text>Debug info</Text>
							<Text>{DataHandler.ip}</Text>
							<Text>{JSON.stringify(this.state.debugText)}</Text>
							<Text>{JSON.stringify(this.state.debugTestText)}</Text>
							<Button onPress={() => this.testConnection()}>Test</Button>
						</View>
					</Modal>
				</Portal>
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
