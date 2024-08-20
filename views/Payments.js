// Payments.js
import React, { useEffect } from 'react';
import TransactionTable from '../componets/ TransactionTable';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import useFetchTransactions from '../fetchData/useFetchTransactions';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Payments = () => {
  const { transactions, loading, error } = useFetchTransactions();



  if (loading) {
    return <SafeAreaView style={styles.container}><Text>Loading...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={styles.container}><Text>Error: {error.message}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
       <PaperProvider> 
       <TransactionTable transactions={transactions} />
         </PaperProvider>

 

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
});

export default Payments;
