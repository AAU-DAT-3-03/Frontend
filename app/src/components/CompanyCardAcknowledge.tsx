import React from 'react';
import { Card, Title, Paragraph, IconButton, MD3Colors } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';

const CompanyCardAcknowledge = () => (
	<Card>
		<Card.Content
			style={{
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				backgroundColor: '#050506',
				borderWidth: 1,
				borderColor: 'grey',
				borderRadius: 5,
				alignItems: 'center',
				paddingRight: 0,
				paddingTop: 0,
				paddingBottom: 0,
				height: 80
			}}
		>
			<Title style={{ color: 'white', flex: 6 }}>INSERT_COMPANY_NAME</Title>
		</Card.Content>
	</Card>
);
const styles = StyleSheet.create({});

export default CompanyCardAcknowledge;
