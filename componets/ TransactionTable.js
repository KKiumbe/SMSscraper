import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DataTable, Text, Button, Dialog, Portal } from 'react-native-paper';

const TransactionTable = ({ transactions }) => {
  const [visible, setVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Helper function to format the date as 'Sunday, 18th'
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time as HH:MM
  const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Sort transactions by timestamp in descending order
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  // Group transactions by formatted date
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Show modal with transaction details
  const showDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setVisible(true);
  };

  // Hide modal
  const hideDetails = () => {
    setVisible(false);
    setSelectedTransaction(null);
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(groupedTransactions).map((date) => (
        <React.Fragment key={date}>
          <Text style={styles.dateText}>{date}</Text>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>Transaction Code</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Number</DataTable.Title>
              <DataTable.Title style={styles.amountColumn}>Amount</DataTable.Title>
              <DataTable.Title style={styles.timeColumn}>Time Paid</DataTable.Title>
            </DataTable.Header>

            {groupedTransactions[date].map((transaction, index) => (
              <DataTable.Row
                key={index}
                onPress={() => showDetails(transaction)}
              >
                <DataTable.Cell>{transaction.transactionCode}</DataTable.Cell>
                <DataTable.Cell>{transaction.name}</DataTable.Cell>
                <DataTable.Cell>{transaction.phoneNumber}</DataTable.Cell>
                <DataTable.Cell style={styles.amountColumn}>
                  {transaction.amountPaid}
                </DataTable.Cell>
                <DataTable.Cell style={styles.timeColumn}>
                  {transaction.timePaid}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <Text style={styles.space}></Text>
        </React.Fragment>
      ))}

      <Portal>
        <Dialog visible={visible} onDismiss={hideDetails}>
          <Dialog.Title>Transaction Details</Dialog.Title>
          <Dialog.Content>
            {selectedTransaction && (
              <View style={styles.modalContent}>
                <Text>Transaction Code: {selectedTransaction.transactionCode}</Text>
                <Text>Name: {selectedTransaction.name}</Text>
                <Text>Number: {selectedTransaction.phoneNumber}</Text>
                <Text>Amount: {selectedTransaction.amountPaid}</Text>
                <Text>Time Paid: {selectedTransaction.timePaid}</Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDetails}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#000', // Dark color for better visibility
  },
  table: {
    backgroundColor: '#fff', // White background for the table
    borderRadius: 8,
    marginBottom: 20,
  },
  amountColumn: {
    flex: 1,
    paddingLeft: 20, // Space between columns
    color: '#000', // Dark color for text
  },
  timeColumn: {
    flex: 1,
    paddingLeft: 20, // Space between columns
    color: '#000', // Dark color for text
  },
  space: {
    height: 20,
  },
  modalContent: {
    padding: 16,
  },
});

export default TransactionTable;
