import React, { Component, ReactNode } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

/**
 * If no appbar is  desired simply don't pass anything
 * Children will be collected automatically from within the html tags
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
	}

	private refreshFinished(): void {
		this.setState({ refreshing: false });
	}

	/**
	 * Calls the passed onRefresh
	 * @param onRefresh
	 * @private
	 */
	private onRefresh(): void {
		if (this.props.onRefresh === undefined) return;
		this.setState({ refreshing: true });
		this.props.onRefresh(this.refreshFinished.bind(this));
	}

	/**
	 * Returns a refresh controller if onRefresh has been specified in the props
	 * @private
	 */
	private getRefreshControl(): React.JSX.Element | undefined {
		if (this.props.onRefresh === undefined) return undefined;
		return <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;
	}

	render(): React.JSX.Element {
		return (
			<View style={{ flexDirection: 'column', height: '100%' }}>
				{this.props.appBar ?? null}
				<ScrollView style={{ flexGrow: 2, overflow: 'hidden' }} refreshControl={this.getRefreshControl()}>
					{this.props.children ?? null}
				</ScrollView>
			</View>
		);
	}
}

export default ContentContainer;
