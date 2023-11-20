import React, { Component } from 'react';
import ContentContainer from '../../components/ContentContainer';
import { Button, Text } from 'react-native-paper';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors, getCurrentTheme } from '../../themes/ThemeManager';
import LocalStorage from '../../utility/LocalStorage';
import Networking from '../../utility/Networking';
import { serverIp } from '../../../App';
import NeticLogo from '../../assets/NeticLogo';

interface LoginProps {
	onLoggedIn: () => void;
}

class Login extends Component<LoginProps> {
	state = {
		email: '',
		password: '',
		error: false
	};

	private tryLogin() {
		new Networking().post(
			serverIp + '/login',
			{ body: { email: this.state.email, password: this.state.password }, sendAuthKey: false },
			(value) => {
				if (value === undefined) {
					this.setState({ error: true });
					return;
				}

				let authKeyPair: string[] | undefined = value[1].headers.get('Set-Cookie')?.split('=');
				if (authKeyPair === undefined || authKeyPair.length < 2 || authKeyPair[0] !== 'authToken') {
					this.setState({ error: true });
					return;
				}

				LocalStorage.setSettingsValue('authKey', authKeyPair[1]);
			}
		);
	}

	private handleLogin() {
		if (this.state.email.length === 0 || this.state.password.length === 0) {
			this.setState({ error: true });
			return;
		}
		LocalStorage.setSettingsValue('authKey', 'test');
		this.props.onLoggedIn();
	}

	render(): React.JSX.Element {
		return (
			<ContentContainer>
				<View style={loginStyle().logo}>
					<NeticLogo />
				</View>
				<View style={loginStyle().wrapper}>
					<View style={loginStyle().containerCard}>
						<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.onSurface, alignSelf: 'center' }}>
							Login
						</Text>
						{this.state.error ? <Text style={{ color: Colors.error, alignSelf: 'center' }}>Credentials not valid</Text> : null}
						<TextInput
							placeholder={'Email'}
							style={{
								backgroundColor: getCurrentTheme().colors.background,
								color: getCurrentTheme().colors.onSurface,
								paddingHorizontal: 8
							}}
							underlineColorAndroid={this.state.error ? Colors.error : getCurrentTheme().colors.secondary}
							onChangeText={(text: string) => {
								this.setState({ email: text });
							}}
							inputMode={'email'}
							textContentType={'emailAddress'}
						/>
						<TextInput
							placeholder={'Password'}
							style={{
								backgroundColor: getCurrentTheme().colors.background,
								color: getCurrentTheme().colors.onSurface,
								paddingHorizontal: 8
							}}
							underlineColorAndroid={this.state.error ? Colors.error : getCurrentTheme().colors.secondary}
							onChangeText={(text: string) => {
								this.setState({ password: text });
							}}
							inputMode={'text'}
							secureTextEntry={true}
							textContentType={'password'}
						/>
						<Button
							buttonColor={getCurrentTheme().colors.secondary}
							textColor={getCurrentTheme().colors.onSurface}
							onPress={() => this.handleLogin()}
						>
							Login
						</Button>
					</View>
				</View>
			</ContentContainer>
		);
	}
}

const loginStyle = () => {
	return StyleSheet.create({
		logo: {
			padding: 120,
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '40%',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		},
		wrapper: {
			flexDirection: 'row',
			height: '100%',
			width: '100%',
			alignItems: 'center',
			padding: 32
		},
		containerCard: {
			borderRadius: 16,
			width: '100%',
			backgroundColor: getCurrentTheme().colors.surface,
			padding: 32,
			flexDirection: 'column',
			justifyContent: 'center',
			gap: 16
		}
	});
};

export default Login;
