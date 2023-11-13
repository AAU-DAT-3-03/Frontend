import React, {Component} from 'react';
import {Card, IconButton, Title, TouchableRipple} from 'react-native-paper';
import {Dimensions, View} from 'react-native';
import {getCurrentTheme} from '../themes/ThemeManager';

enum Status {
    Priority1,
    Priority2,
    Priority3,
    Priority4,
}

interface PrioritySelectorProps {
    company: string;
    state: Status;
    onPress: () => void;
}

interface PrioritySelectorState {
    state: Status;
}

class PrioritySelector extends Component<PrioritySelectorProps, PrioritySelectorState> {
    state: PrioritySelectorState = {
        state: Status.Priority4
    };

    constructor(props: PrioritySelectorProps) {
        super(props);
        this.state.state = props.state;
    }

    private acknowledgeIconRender() {
        return (
            <>
                <IconButton icon="account-check-outline" iconColor={'white'} size={25}
                            style={{backgroundColor: '#E1B000'}}/>
                <View
                    style={{
                        backgroundColor: '#E1B000',
                        width: 14,
                        height: '100%',
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        marginRight: 0.4
                    }}
                />
            </>
        );
    }

    private ErrorIconRender() {
        return (
            <>
                <IconButton
                    icon="exclamation"
                    iconColor={getCurrentTheme().colors.onError}
                    size={25}
                    containerColor={getCurrentTheme().colors.error}
                />
                <View
                    style={{
                        backgroundColor: getCurrentTheme().colors.error,
                        width: 14,
                        height: '100%',
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        marginRight: 0.4
                    }}
                />
            </>
        );
    }

    render(): React.JSX.Element {
        return (
            <TouchableRipple onPress={() => this.props.onPress()} rippleColor={'rgba(255, 255, 255, 0.3)'}>
                <Card
                    style={{
                        backgroundColor: getCurrentTheme().colors.surface,
                        borderWidth: 1,
                        borderColor: 'grey',
                        height: Dimensions.get('screen').height / 17
                    }}
                >
                    <Card.Content
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            paddingRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            height: '100%'
                        }}
                    >
                        <Title style={{color: getCurrentTheme().colors.onSurface, flex: 6}}>{this.props.company}</Title>
                        {this.state.state === Status.Priority1 ? this.acknowledgeIconRender() : null}
                        {this.state.state === Status.Priority2 ? this.ErrorIconRender() : null}
                    </Card.Content>
                </Card>
            </TouchableRipple>
        );
    }
}

export default PrioritySelector;