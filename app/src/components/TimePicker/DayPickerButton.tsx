import React, { Component } from 'react';
import { getCurrentTheme } from '../../themes/ThemeManager';
import Color from 'color';
import { Surface, Text, TouchableRipple } from 'react-native-paper';
import { Dimensions, ScaledSize, View } from 'react-native';

interface DayPickerButtonProps {
	children: React.ReactNode[] | React.ReactNode;
	selected?: boolean;
	primary?: boolean;
	today?: boolean;
	onPress?: () => void;
}

class DayPickerButton extends Component<DayPickerButtonProps> {
	render(): React.JSX.Element {
		let screenSize: ScaledSize = Dimensions.get('screen');
		let backgroundColor: string | undefined = this.props.selected
			? this.props.primary
				? getCurrentTheme().colors?.secondary
				: getCurrentTheme().colors?.primary
			: undefined;
		let rippleColor: string = this.props.selected
			? Color(getCurrentTheme().colors?.surface).alpha(0.3).string()
			: Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string();
		return (
			<Surface mode={'flat'} elevation={0}>
				<TouchableRipple
					style={{
						borderStyle: undefined,
						borderRadius: 100,
						backgroundColor: backgroundColor,
						borderColor: this.props.today ? getCurrentTheme().colors?.onSurface : getCurrentTheme().colors?.surface,
						borderWidth: 2,
						aspectRatio: 1,
						maxHeight: screenSize.height / 10,
						maxWidth: screenSize.width / 10
					}}
					onPress={this.props.onPress}
					rippleColor={rippleColor}
					borderless={true}
				>
					<View style={{ width: '100%', aspectRatio: 1 }}>
						<Text
							variant={'labelLarge'}
							selectable={false}
							style={{
								height: '100%',
								textAlign: 'center',
								textAlignVertical: 'center',
								color: this.props.selected ? getCurrentTheme().colors?.onPrimary : getCurrentTheme().colors?.onSurface
							}}
						>
							{this.props.children}
						</Text>
					</View>
				</TouchableRipple>
			</Surface>
		);
	}
}

export default DayPickerButton;
