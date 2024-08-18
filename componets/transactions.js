import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

import TransactionTable from './ TransactionTable';

import useFetchTransactions from '../fetchData/useFetchTransactions';

const Transaction = () => {
  const { transactions, loading, error } = useFetchTransactions();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading transactions: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <Text>No transactions available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
});

export default Transaction;
