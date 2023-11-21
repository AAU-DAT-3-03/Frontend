import React, { Component } from 'react';
import Svg, { Circle, G, Mask, Polygon, Rect, Text } from 'react-native-svg';
import { Colors, getCurrentTheme } from '../themes/ThemeManager';

interface DialProps {
	percentage: number;
	thickness?: number;
	scale?: number;
	header?: string;
	subHeader?: string;
}

interface DialState {
	percentage: number;
	thickness: number;
	scale: number;
	header?: string;
	subHeader?: string;
}

class Dial extends Component<DialProps, DialState> {
	private percentColor75: string = Colors.error;
	private percentColor50: string = Colors.warn;
	private percentColor0: string = Colors.allGood;

	state: DialState = {
		percentage: 0,
		thickness: 10,
		scale: 1,
		header: undefined,
		subHeader: undefined
	};

	constructor(props: DialProps) {
		super(props);
		this.state.percentage = props.percentage;
		this.state.scale = props.scale ?? 1;
		this.state.thickness = props.thickness ?? 15 * this.state.scale;
		this.state.subHeader = props.subHeader;
		this.state.header = props.header;
	}

	/**
	 * Convert degrees to radians
	 * @param {number} degree - Degrees 0-360
	 * @private
	 * @return {number} - Radians
	 */
	private degreeToRad(degree: number): number {
		return degree * (Math.PI / 180);
	}

	/**
	 * Calculates the position of one point in a polygon based on a circle to show the correct percentage in the dial
	 * @private
	 */
	private calculateXYForPercentage(percentage: number, radius: number, scale: number): [number, number] {
		// Ensure percentage is between 0 - 100
		percentage = Math.max(Math.min(percentage, 100), 0);
		radius = radius * scale;
		// Calculate the degree for a half circle
		let degree: number = Math.floor(percentage * 1.8);
		// Calculate x, y
		let [x, y]: [number, number] = [
			radius * Math.cos(this.degreeToRad(degree)),
			radius * Math.sin(this.degreeToRad(degree)) - 50 * scale
		];
		// Rotate it 180 degrees and shift it into position on the x-axis
		let rotateBy: number = this.degreeToRad(180);
		return [x * Math.cos(rotateBy) - y * Math.sin(rotateBy) + 50 * scale, x * Math.sin(rotateBy) + y * Math.cos(rotateBy)];
	}

	/**
	 * Get the foreground color base on the percentage in the current state
	 * @private
	 * @return {string} - color in hex (#xxxxxx)
	 */
	private getForegroundColor(): string {
		if (this.state.percentage < 50) return this.percentColor0;
		if (this.state.percentage < 75) return this.percentColor50;
		return this.percentColor75;
	}

	/**
	 * Creates the dial svg
	 * @param {DialState} state - Current dial state
	 * @private
	 */
	private dialRender(state: DialState): React.JSX.Element {
		let [x, y]: [number, number] = this.calculateXYForPercentage(this.state.percentage, 100, state.scale);
		let bigCircleRadius: number = 50 * state.scale;
		let smallCircleRadius: number = bigCircleRadius - state.thickness;
		let foreground: string = this.getForegroundColor();
		return (
			<Svg width={100 * state.scale} height={bigCircleRadius}>
				{/* Creates a mask for only the arc of the dial */}
				<Mask id={'dialMask'}>
					<Circle cx={bigCircleRadius} cy={bigCircleRadius} r={bigCircleRadius} fill="white" />
					<Circle cx={bigCircleRadius} cy={bigCircleRadius} r={smallCircleRadius} fill="black" />
					<Rect
						fill="black"
						width={120 * state.scale}
						height={bigCircleRadius}
						translateX={0}
						translateY={bigCircleRadius}
					></Rect>
				</Mask>
				{/* Creates a polygon mask that contains only the percentage area */}
				<Mask id={'percentMask'}>
					<Polygon
						fill={'white'}
						points={`0,${bigCircleRadius} ${bigCircleRadius},${bigCircleRadius} ${x},${y} 0,${-bigCircleRadius}`}
					/>
				</Mask>

				{/* Create the actual dial */}
				<G mask={'url(#dialMask)'}>
					{/* Background dial */}
					<Circle
						id="dial"
						cx={bigCircleRadius}
						cy={bigCircleRadius}
						r={bigCircleRadius}
						fill={getCurrentTheme().colors.background}
					/>
					{/* Foreground dial masked by the polygon mask */}
					<G mask={'url(#percentMask)'}>
						<Circle id="dial" cx={bigCircleRadius} cy={bigCircleRadius} r={bigCircleRadius} fill={foreground} />
					</G>
				</G>

				{/* The header text if it has been passed */}
				{state.header ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={13 * state.scale}
						x={bigCircleRadius - state.header?.length / 2}
						y={bigCircleRadius - 13 * state.scale}
					>
						{state.header}
					</Text>
				) : null}

				{/* The sub header text if it has been passed */}
				{state.subHeader ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={11 * state.scale}
						x={bigCircleRadius - state.subHeader?.length / 2}
						y={bigCircleRadius}
					>
						{state.subHeader}
					</Text>
				) : null}
			</Svg>
		);
	}

	render(): React.JSX.Element {
		return this.dialRender(this.state);
	}
}

export default Dial;
