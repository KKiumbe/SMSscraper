import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TransactionTable = ({ transactions }) => {
  // Define table headers
  const tableHead = ['Name', 'Phone Number', 'Amount Paid', 'Date'];

  // Map transactions to table rows
  const tableData = transactions.map(transaction => [
    transaction.name,  // Include the name first
    transaction.phoneNumber,
    transaction.amountPaid,
    new Date(transaction.timestamp).toLocaleDateString(), // Format timestamp
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tableContainer}>
        <Table borderStyle={styles.tableBorder}>
          <Row data={tableHead} style={styles.header} textStyle={styles.headerText} />
          <Rows data={tableData} textStyle={styles.rowText} />
        </Table>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tableContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#c8e1ff',
  },
  header: {
    height: 50,
    backgroundColor: '#f1f8ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  rowText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    paddingVertical: 8,
  },
});

export default TransactionTable;
