import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';
import useFetchNewCustomers from '../fetchData/useFetchNewCustomers';
import useFetchReturningCustomers from '../fetchData/useFetchReturningCustomers';
import useFetchCustomerCount from '../fetchData/useFetchCustomerCount';



const Stats = ({ newCustomers, returningCustomers, allContacts }) => {

 

  const getMonthName = () => {
    const now = new Date();
    const options = { month: 'long' };
    return now.toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Stats</Text>
      <View style={styles.stats}>
        <View style={styles.statsItem}>
          <ProgressCircle
            size={100}
            borderWidth={8}
            color={'#27ae60'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            progress={newCustomers / 100}  // Ensure the circle is filled based on newCustomers
            formatText={() => `${newCustomers}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>{newCustomers} New Customers this {getMonthName()}</Text>
        </View>
        <View style={styles.statsItem}>
          <ProgressCircle
            size={100}
            borderWidth={8}
            color={'#2980b9'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            progress={allContacts > 0 ? (returningCustomers / allContacts) : 0}  // Ensure the circle is filled based on returningCustomers
            formatText={() => `${returningCustomers}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>{returningCustomers} Returning Customers</Text>
        </View>
        <View style={styles.statsItem}>
          <ProgressCircle
            size={100}
            borderWidth={8}
            color={'#c0392b'}
            unfilledColor={'#e1e1e1'}
            strokeCap={'round'}
            progress={1}  // Full circle for allContacts
            formatText={() => `${allContacts}`}
            textStyle={styles.progressText}
          />
          <Text style={styles.statsLabel}>You have {allContacts} Contacts</Text>
        </View>
      </View>
    </View>
  );
};

const Dashboard = ({ navigation }) => {
  const newCustomers = useFetchNewCustomers();
  const returningCustomers = useFetchReturningCustomers();
  const {count} = useFetchCustomerCount();

  console.log(newCustomers);
  console.log(returningCustomers);
  console.log(count);

  return (
    <SafeAreaView style={styles.container}>
      <Stats
        newCustomers={newCustomers}
        returningCustomers={returningCustomers}
        allContacts={count}
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
    alignItems: 'center',
  },
  statsItem: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 10,
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

export default Dashboard;
