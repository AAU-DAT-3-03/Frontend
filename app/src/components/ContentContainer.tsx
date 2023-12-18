import React, { Component, ReactNode } from 'react';
import { Appearance, RefreshControl, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { getCurrentTheme } from '../themes/ThemeManager';
import { Appbar } from 'react-native-paper';

/**
 * If no appbar is  desired simply don't pass anything
 * Children will be collected automatically from within the tags
 */
interface ContentContainerProps {
	appBar?: React.JSX.Element;
	onRefresh?: (finished: () => void) => void;
	children?: ReactNode[] | ReactNode;
}

interface ContentContainerState {
	refreshing: boolean;
}

class ContentContainer extends Component<ContentContainerProps, ContentContainerState> {
	state: ContentContainerState = {
		refreshing: false
	};

	constructor(props: ContentContainerProps) {
		super(props);
		// Triggers when appearance of page changes, to ensure proper re-render
		Appearance.addChangeListener(() => {
			this.forceUpdate();
		});
	}

	/**
	 * Triggered once refresh of the page is finished, stops the refreshing animation
	 */
	private refreshFinished(): void {
		this.setState({ refreshing: false });
	}

	/**
	 * Calls the passed onRefresh if given in props
	 */
	private onRefresh(): void {
		if (this.props.onRefresh === undefined) return;
		this.setState({ refreshing: true });
		this.props.onRefresh(this.refreshFinished.bind(this));
	}

	/**
	 * Returns a refresh controller if onRefresh has been specified in the props.
	 * Refresh controller handles the refresh animation, and starts it when pulling down on the page.
	 */
	private getRefreshControl(): React.JSX.Element | undefined {
		if (this.props.onRefresh === undefined) return undefined;
		return <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;
	}

	render(): React.JSX.Element {
		let wrapperStyle: StyleProp<ViewStyle> = {
			flexDirection: 'column',
			height: '100%',
			backgroundColor: getCurrentTheme().colors.background
		};
		return (
			<View style={wrapperStyle}>
				{/* Render app bar if given in props */}
				{this.props.appBar === undefined ? null : (
					<Appbar style={{ backgroundColor: getCurrentTheme().colors.surface }}>{this.props.appBar}</Appbar>
				)}
				<ScrollView refreshControl={this.getRefreshControl()}>{this.props.children ?? null}</ScrollView>
			</View>
		);
	}
}

export default ContentContainer;
