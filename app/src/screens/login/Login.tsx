import React, { Component } from 'react';
import ContentContainer from '../../components/ContentContainer';
import { Button, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Colors, getCurrentTheme } from '../../themes/ThemeManager';
import LocalStorage from '../../utility/LocalStorage';

interface LoginProps {
	onLoggedIn: () => void;
}

class Login extends Component<LoginProps> {
	state = {
		email: '',
		password: '',
		error: false
	};

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
				<View style={loginStyle().wrapper}>
					<View style={loginStyle().containerCard}>
						<Text variant={'titleLarge'} style={{ color: getCurrentTheme().colors.onSurface, alignSelf: 'center' }}>
							Login
						</Text>
						{this.state.error ? <Text style={{ color: Colors.error, alignSelf: 'center' }}>Credentials not valid</Text> : null}
						<TextInput
							style={{ backgroundColor: getCurrentTheme().colors.background }}
							textColor={getCurrentTheme().colors.onBackground}
							error={this.state.error}
							onChangeText={(text: string) => {
								this.setState({ email: text });
							}}
							inputMode={'email'}
							textContentType={'emailAddress'}
							label={'Email'}
						/>
						<TextInput
							style={{ backgroundColor: getCurrentTheme().colors.background }}
							textColor={getCurrentTheme().colors.onBackground}
							error={this.state.error}
							onChangeText={(text: string) => {
								this.setState({ password: text });
							}}
							inputMode={'text'}
							secureTextEntry={true}
							textContentType={'password'}
							label={'Password'}
						/>
						<Button
							buttonColor={getCurrentTheme().colors.primary}
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
