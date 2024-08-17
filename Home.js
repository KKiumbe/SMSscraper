import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import ProgressCircle from 'react-native-progress/Circle'; // Import the ProgressCircle component
import getReturningCustomerCount from './returnCustomers';
import { fetchCustomerCount, fetchNewCustomers } from './fetchCustomers';

const Stats = ({ newCustomers, returningCustomers, allContacts }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Stats</Text>
      <View style={styles.stats}>
        <View style={styles.statsItem}>
          <ProgressCircle
            progress={newCustomers / 200} // Assuming 200 as max value
            size={100} // Set the size to be the same for all
            borderWidth={8}
            color={'#27ae60'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            formatText={() => `${newCustomers}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>New Customers</Text>
        </View>
        <View style={styles.statsItem}>
          <ProgressCircle
            progress={returningCustomers / 100} // Assuming 100 as max value
            size={100} // Set the size to be the same for all
            borderWidth={8}
            color={'#2980b9'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            formatText={() => `${returningCustomers}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>Returning Customers</Text>
        </View>
        <View style={styles.statsItem}>
          <ProgressCircle
            progress={allContacts / 1000} // Assuming 1000 as max value
            size={100} // Set the size to be the same for all
            borderWidth={8}
            color={'#c0392b'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            formatText={() => `${allContacts}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>All Contacts</Text>
        </View>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [newCustomers, setNewCustomers] = useState(0);
  const [returningCustomers, setReturningCustomers] = useState(0);
  const [allContacts, setAllContacts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerCount = await fetchCustomerCount();
        const newCustomerCount = await fetchNewCustomers();
        const returningCustomerCount = await getReturningCustomerCount();

        setAllContacts(customerCount);
        setNewCustomers(newCustomerCount);
        setReturningCustomers(returningCustomerCount);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stats
        newCustomers={newCustomers}
        returningCustomers={returningCustomers}
        allContacts={allContacts}
      />
      <Button
        title="Go to Transaction"
        onPress={() => navigation.navigate('Transaction')}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Center items vertically
  },
  statsItem: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginTop: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomeScreen;
