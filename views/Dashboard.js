import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import useFetchNewCustomers from '../fetchData/useFetchNewCustomers';
import useFetchReturningCustomers from '../fetchData/useFetchReturningCustomers';
import useFetchCustomerCount from '../fetchData/useFetchCustomerCount';

const Stats = ({ newCustomers, returningCustomers, allContacts }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Stats</Text>
      <View style={styles.stats}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{newCustomers}</Title>
            <Paragraph style={styles.cardText}>
              New Customers this {new Date().toLocaleDateString(undefined, { month: 'long' })}
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{returningCustomers}</Title>
            <Paragraph style={styles.cardText}>
              Returning Customers
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{allContacts}</Title>
            <Paragraph style={styles.cardText}>
              Total Contacts
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.promoCard}>
          <Card.Content>
            <Paragraph style={styles.promoText}>
              Double the number of returning customers, Send Bulk SMS to all customers!
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const Dashboard = ({ navigation }) => {
 
 
  const {countReturning} = useFetchReturningCustomers();
  console.log(countReturning)
  const { count } = useFetchCustomerCount();
  console.log(count)
  const  countNewCustomers  = useFetchNewCustomers();
  console.log(countNewCustomers)

  return (
    <SafeAreaView style={styles.container}>
      <Stats
        newCustomers={countNewCustomers}
        returningCustomers={countReturning}
        allContacts={count}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Send SMS')}
        style={styles.button}
      >
        Send Bulk SMS
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginBottom: 12,
    padding: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1d',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  promoCard: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#eafaf1', // Light green color for the promo card
  },
  promoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d1d1d',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});

export default Dashboard;
