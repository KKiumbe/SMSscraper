import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { db } from '../config/firebaseConfig';

const useFetchReturningCustomers = () => {
  const [returningCustomers, setReturningCustomers] = useState(0);

  useEffect(() => {
    const fetchReturningCustomers = async () => {
      const transactionsCollectionRef = collection(db, 'Transactions');

      const now = moment();
      const startOfMonth = now.startOf('month').toDate().getTime();
      const endOfMonth = now.endOf('month').toDate().getTime();

      const q = query(
        transactionsCollectionRef,
        where('timestamp', '>=', startOfMonth),
        where('timestamp', '<=', endOfMonth)
      );

      try {
        const querySnapshot = await getDocs(q);
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
      } catch (error) {
        console.error('Error retrieving returning customer count:', error);
        setReturningCustomers(0);
      }
    };

    fetchReturningCustomers();
  }, []);

  return returningCustomers;
};

export default useFetchReturningCustomers;
