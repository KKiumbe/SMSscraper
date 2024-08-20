import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { db } from '../config/firebaseConfig';

const useFetchReturningCustomers = () => {
  const [returningCustomers, setReturningCustomers] = useState(0);

  useEffect(() => {
    const transactionsCollectionRef = collection(db, 'Transactions');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const q = query(
      transactionsCollectionRef,
      where('timestamp', '>=', Timestamp.fromDate(startOfMonth)),
      where('timestamp', '<=', Timestamp.fromDate(endOfMonth))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customerTransactionCount = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const phoneNumber = data.phoneNumber;

        if (!customerTransactionCount[phoneNumber]) {
          customerTransactionCount[phoneNumber] = 0;
        }
        customerTransactionCount[phoneNumber]++;
      });

      const returningCustomerCount = Object.values(customerTransactionCount).filter(count => count > 2).length;
      setReturningCustomers(returningCustomerCount);
    }, (error) => {
      console.error('Error retrieving returning customer count:', error);
      setReturningCustomers(0);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return returningCustomers;
};

export default useFetchReturningCustomers;
