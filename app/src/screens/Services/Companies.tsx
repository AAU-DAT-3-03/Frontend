import React, {Component} from 'react';
import {Appbar} from 'react-native-paper';
import ContentContainer from '../../components/ContentContainer';
import CompanyCard from '../../components/CompanyCard';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationProp} from '@react-navigation/native';
import CompanyServiceList from './sub_screens/CompanyServiceList';
import {ActivityIndicator, FlatList, View} from "react-native";
import {companies, randomInt} from '../home/IncidentGenerator'

const Stack = createStackNavigator();

interface CompanyData {
    service: string;
    id: number | undefined;
    state: number | undefined;

}


interface CompanyState {
    loading: boolean;
    companies: CompanyData[];
}

async function getCompanyData() {
    let promise: Promise<CompanyData[]> = new Promise((resolve): void => {
        setTimeout(() => {
            let companiesdata: CompanyData[] = [];
            for (let company of companies) {
                companiesdata.push({service: company, state: randomInt(0, 2), id: randomInt(0, 100000000)})

            }
            resolve(companiesdata);
        }, 3000);
    });
    return await promise;
}


class Companies extends Component<any, CompanyState> {
    state: CompanyState = {
        loading: true,
        companies: [],

    };

    componentDidMount() {
        getCompanyData().then((value) =>
            this.setState({
                loading: false,
                companies: value
            })
        );
    }

    private AppBar(): React.JSX.Element {
        return (
            <Appbar>
                <Appbar.Content title={'Companies'}/>
            </Appbar>
        );
    }

    private onPress(company: number, navigation: NavigationProp<any>): void {
        navigation.navigate('ServiceList', {
            company: company
        });
    }

    private servicesRender(navigation: NavigationProp<any>) {
        return (
            <ContentContainer appBar={this.AppBar()}>
                {this.state.loading ? (
                    <ActivityIndicator></ActivityIndicator>
                ) : (
                    <View>
                        <FlatList data={this.state.companies}
                                  renderItem={(info) => <CompanyCard company={info.item.service}
                                                                     state={info.item.state ?? -1}
                                                                     onPress={() => this.onPress(info.item.id ?? -1, navigation)}/>}/>

                    </View>
                )}
            </ContentContainer>
        );
    }

    render(): React.JSX.Element {
        return (
            <Stack.Navigator initialRouteName={'ServiceRender'}>
                <Stack.Screen options={{headerShown: false}} name="ServiceRender">
                    {(props) => this.servicesRender(props.navigation)}
                </Stack.Screen>
                <Stack.Screen options={{headerShown: false}} name="ServiceList">
                    {(props: any) => <CompanyServiceList {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }
}

export default Companies;
