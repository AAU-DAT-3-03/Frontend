import React, { Component } from 'react';
import Svg, { Circle, G, Mask, Polygon, Rect, Text } from 'react-native-svg';

interface DialProps {
	percentage: number;
	thickness?: number;
	scale?: number;
	header?: string;
	subHeader?: string;
	foreground?: string;
	background?: string;
}

interface DialState {
	percentage: number;
	thickness: number;
	scale: number;
	foreground: string;
	background: string;
	header?: string;
	subHeader?: string;
}

class Dial extends Component<DialProps, DialState> {
	private degreeToRad(degree: number): number {
		return degree * (Math.PI / 180);
	}
	state: DialState = {
		percentage: 0,
		thickness: 10,
		scale: 1,
		header: undefined,
		subHeader: undefined,
		foreground: '',
		background: ''
	};

	constructor(props: DialProps) {
		super(props);
		this.state.percentage = props.percentage;
		this.state.scale = props.scale ?? 1;
		this.state.thickness = props.thickness ?? 10 * this.state.scale;
		this.state.subHeader = props.subHeader;
		this.state.header = props.header;
		this.state.foreground = props.foreground ?? '#0f0';
		this.state.background = props.background ?? '#f00';
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

	private dialRender(state: DialState): React.JSX.Element {
		let [x, y]: [number, number] = this.calculateXYForPercentage(this.state.percentage, 100, state.scale);
		let toCenter: number = 50 * state.scale;
		let bigCircleRadius: number = 40 * state.scale;
		let smallCircleRadius: number = bigCircleRadius - state.thickness;
		return (
			<Svg width={100 * state.scale} height={toCenter}>
				{/* Creates a mask for only the arc of the dial */}
				<Mask id={'dialMask'}>
					<Circle cx={toCenter} cy={toCenter} r={bigCircleRadius} fill="white" />
					<Circle cx={toCenter} cy={toCenter} r={smallCircleRadius} fill="black" />
					<Rect fill="black" width={120 * state.scale} height={bigCircleRadius} translateX={0} translateY={toCenter}></Rect>
				</Mask>

				{/* Creates a polygon mask that contains only the percentage area */}
				<Mask id={'percentMask'}>
					<Polygon fill={'white'} points={`0,${toCenter} ${toCenter},${toCenter} ${x},${y} 0,${-toCenter}`} />
				</Mask>

				{/* Create the actual dial polygon */}
				<G mask={'url(#dialMask)'}>
					{/* Background dial */}
					<Circle id="dial" cx={toCenter} cy={toCenter} r={bigCircleRadius} fill={state.background} />
					{/* Foreground dial masked by the polygon mask */}
					<G mask={'url(#percentMask)'}>
						<Circle id="dial" cx={toCenter} cy={toCenter} r={bigCircleRadius} fill={state.foreground} />
					</G>
				</G>

				{/* The header text if it has been passed */}
				{state.header ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={14 * state.scale}
						x={toCenter - state.header?.length / 2}
						y={toCenter - 14 * state.scale}
					>
						{state.header}
					</Text>
				) : null}

				{/* The sub header text if it has been passed */}
				{state.subHeader ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={12 * state.scale}
						x={toCenter - state.subHeader?.length / 2}
						y={toCenter}
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
