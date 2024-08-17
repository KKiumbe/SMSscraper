import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import TransactionTable from './ TransactionTable';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Reference to the Firestore collection
        const transactionsCollectionRef = collection(db, 'Transactions');

        // Fetch documents from the collection
        const snapshot = await getDocs(transactionsCollectionRef);

        if (!snapshot.empty) {
          // Map documents to an array of transaction objects
          const transactionsArray = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTransactions(transactionsArray);
        } else {
          console.log('No transactions found.');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, margin: 20 }}>Monthly Transactions</Text>
        <TransactionTable transactions={transactions} />
      </View>
    </ScrollView>
  );
};

export default Transaction;
