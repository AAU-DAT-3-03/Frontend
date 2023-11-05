import * as React from 'react';
import { Button, Card, IconButton,Title } from 'react-native-paper';



const AddUser = () => (
    <Card>
        <Card.Content style={{backgroundColor: '#141218',
            borderWidth:1,
            borderColor:'#938F99',
            flexDirection:'row',
            alignItems:'center',
            height: 70,
            borderRadius: 20,}}>
            <Title style={{color:'white',
                           fontSize:16,}}>
                assigned
            </Title>


            <IconButton
                icon="plus-circle"
                iconColor={'#CAC4D0'}
                size={20}
                onPress={() => console.log('Pressed')}
                style={{borderRadius:100,
                        borderWidth: 2,}}
            />
        </Card.Content>
    </Card>
);

export default AddUser;