import React, { Component } from 'react';
import { getCurrentTheme } from '../../themes/ThemeManager';
import Color from 'color';
import { Surface, Text, TouchableRipple } from 'react-native-paper';
import { Dimensions, ScaledSize, StyleSheet, View } from 'react-native';

interface DayPickerButtonProps {
	children: React.ReactNode[] | React.ReactNode;
	selected?: boolean;
	primary?: boolean;
	today?: boolean;
	onPress?: () => void;
	disabled?: boolean;
}

class DayPickerButton extends Component<DayPickerButtonProps> {
	render(): React.JSX.Element {
		let screenSize: ScaledSize = Dimensions.get('screen');
		let borderColor: string = this.props.today ? getCurrentTheme().colors?.onSurface : getCurrentTheme().colors?.surface;

		let rippleColor: string = Color(getCurrentTheme().colors?.onSurface).alpha(0.3).string();
		let backgroundColor: string | undefined;
		let textColor: string = getCurrentTheme().colors?.onSurface;

		// If date is selected
		if (this.props.selected) {
			backgroundColor = getCurrentTheme().colors?.primary;
			rippleColor = Color(getCurrentTheme().colors?.surface).alpha(0.3).string();
			textColor = getCurrentTheme().colors?.onPrimary;

			// if date is the end or start date
			if (this.props.primary) {
				backgroundColor = getCurrentTheme().colors?.tertiary;
			}
		} else if (this.props.disabled) {
			textColor = getCurrentTheme().colors.surfaceDisabled;
		}

		let style = styleSheet(textColor, backgroundColor, borderColor, screenSize);

		return (
			<Surface mode={'flat'} elevation={0}>
				<TouchableRipple
					style={style.rippleStyle}
					onPress={this.props.disabled === true ? undefined : this.props.onPress}
					rippleColor={rippleColor}
					borderless={true}
				>
					<View style={style.textWrapper}>
						<Text variant={'labelLarge'} selectable={false} style={style.text}>
							{this.props.children}
						</Text>
					</View>
				</TouchableRipple>
			</Surface>
		);
	}
}

const styleSheet = (textColor: string, backgroundColor: string | undefined, borderColor: string, screenSize: ScaledSize) => {
	return StyleSheet.create({
		textWrapper: {
			width: '100%',
			aspectRatio: 1
		},
		text: {
			height: '100%',
			textAlign: 'center',
			textAlignVertical: 'center',
			color: textColor
		},
		rippleStyle: {
			borderStyle: undefined,
			borderRadius: 100,
			backgroundColor: backgroundColor,
			borderColor: borderColor,
			borderWidth: 2,
			aspectRatio: 1,
			maxHeight: screenSize.height / 10,
			maxWidth: screenSize.width / 10
		}
	});
};

export default DayPickerButton;
