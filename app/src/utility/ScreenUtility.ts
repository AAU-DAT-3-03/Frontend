import { Dimensions, ScaledSize } from 'react-native';

export function isLandscape(): boolean {
	let dimensions: ScaledSize = Dimensions.get('screen');
	return dimensions.width >= dimensions.height;
}
