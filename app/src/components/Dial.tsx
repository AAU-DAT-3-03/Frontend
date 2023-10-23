import React, { Component } from 'react';
import Svg, { Circle, G, Mask, Polygon, Rect, Text } from 'react-native-svg';

interface DialProps {
	percentage: number;
	scale?: number;
	header?: string;
	subHeader?: string;
	foreground?: string;
	background?: string;
}

interface DialState {
	percentage: number;
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
		this.state.subHeader = props.subHeader;
		this.state.header = props.header;
		this.state.foreground = props.foreground ?? '#0f0';
		this.state.background = props.background ?? '#f00';
	}

	private calculateXY(percentage: number, radius: number, scale: number): [number, number] {
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
		let rotateBy = this.degreeToRad(180);
		return [x * Math.cos(rotateBy) - y * Math.sin(rotateBy) + 50 * scale, x * Math.sin(rotateBy) + y * Math.cos(rotateBy)];
	}

	private dialRender(state: DialState): React.JSX.Element {
		let [x, y]: [number, number] = this.calculateXY(this.state.percentage, 100, state.scale);
		return (
			<Svg width={100 * state.scale} height={50 * state.scale}>
				<Mask id={'dialMask'}>
					<Circle cx={50 * state.scale} cy={50 * state.scale} r={40 * state.scale} fill="white" />
					<Circle cx={50 * state.scale} cy={50 * state.scale} r={30 * state.scale} fill="black" />
					<Rect
						fill="black"
						width={120 * state.scale}
						height={40 * state.scale}
						translateX={0}
						translateY={50 * state.scale}
					></Rect>
				</Mask>
				<Mask id={'percentMask'}>
					<Polygon
						fill={'white'}
						points={`0,${50 * state.scale} ${50 * state.scale},${50 * state.scale} ${x},${y} 0,${-50 * state.scale}`}
					/>
				</Mask>
				<G mask={'url(#dialMask)'}>
					<Circle id="dial" cx={50 * state.scale} cy={50 * state.scale} r={40 * state.scale} fill={state.background} />
					<G mask={'url(#percentMask)'}>
						<Circle id="dial" cx={50 * state.scale} cy={50 * state.scale} r={40 * state.scale} fill={state.foreground} />
					</G>
				</G>
				{state.header ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={14}
						x={50 * state.scale - state.header?.length / 2}
						y={50 * state.scale - 13}
					>
						{state.header}
					</Text>
				) : null}
				{state.subHeader ? (
					<Text
						fill={'#fff'}
						textAnchor={'middle'}
						fontSize={12}
						x={50 * state.scale - state.subHeader?.length / 2}
						y={50 * state.scale}
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
