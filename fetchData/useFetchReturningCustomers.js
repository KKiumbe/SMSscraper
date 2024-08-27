import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchReturningCustomers = () => {
  const [returningCustomers, setReturningCustomers] = useState([]);

  useEffect(() => {
    const fetchReturningCustomers = async () => {
      try {
        // Check local storage for cached data
        const cachedData = await AsyncStorage.getItem('returningCustomers');
        if (cachedData) {
          setReturningCustomers(JSON.parse(cachedData));
        }

        const transactionsCollectionRef = collection(db, 'Transactions');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const q = query(
          transactionsCollectionRef,
          where('timestamp', '>=', Timestamp.fromDate(startOfMonth)),
          where('timestamp', '<=', Timestamp.fromDate(endOfMonth))
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const customerTransactionCount = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const phoneNumber = data.phoneNumber;
            const name = data.name;  // Assuming 'name' is stored in the transaction document

            if (!customerTransactionCount[phoneNumber]) {
              customerTransactionCount[phoneNumber] = {
                name,
                count: 0
              };
            }

            customerTransactionCount[phoneNumber].count++;
          });

          const returningCustomersData = Object.values(customerTransactionCount)
            .filter(customer => customer.count > 2)
            .map(customer => ({
              name: customer.name,
              phoneNumber: customer.phoneNumber,
            }));

          setReturningCustomers(returningCustomersData);

          // Cache the data in local storage
          await AsyncStorage.setItem('returningCustomers', JSON.stringify(returningCustomersData));
          console.log(returningCustomersData);
        }, (error) => {
          console.error('Error retrieving returning customers:', error);
          setReturningCustomers([]);
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching returning customers:', error);
        setReturningCustomers([]);
      }
    };

    fetchReturningCustomers();
  }, []);

  return returningCustomers;
};

export default useFetchReturningCustomers;
