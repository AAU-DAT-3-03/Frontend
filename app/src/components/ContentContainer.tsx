import React, { Component, ReactNode } from 'react';
import { ScrollView } from 'react-native';

/**
 * If no appbar is  desired simply don't pass anything
 * Children will be collected automatically from within the html tags
 */
interface ContentContainerProps {
	appBar?: React.JSX.Element;
	children?: ReactNode[] | ReactNode;
}

class ContentContainer extends Component<ContentContainerProps> {
	constructor(props: ContentContainerProps) {
		super(props);
	}

	render(): React.JSX.Element {
		return (
			<>
				{this.props.appBar ?? null}
				<ScrollView>{this.props.children ?? null}</ScrollView>
			</>
		);
	}
}

export default ContentContainer;
