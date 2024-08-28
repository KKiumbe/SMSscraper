import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const useFetchReturningCustomers = () => {
  const [returningCustomers, setReturningCustomers] = useState([]);
  const [countReturning, setCountReturning] = useState(0);

  useEffect(() => {
    const fetchReturningCustomers = async () => {
      try {
        const transactionsCollectionRef = collection(db, 'Transactions');
        const q = query(transactionsCollectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const customerTransactionCount = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const phoneNumber = data.phoneNumber;
            const name = data.name;

            if (!customerTransactionCount[phoneNumber]) {
              customerTransactionCount[phoneNumber] = {
                name,
                count: 0,
              };
            }

            customerTransactionCount[phoneNumber].count++;
          });

          const returningCustomersData = Object.entries(customerTransactionCount)
            .filter(([_, customer]) => customer.count > 2)
            .map(([phoneNumber, customer]) => ({
              name: customer.name,
              phoneNumber: phoneNumber,
              transactionCount: customer.count,
            }));

          setReturningCustomers(returningCustomersData);
          setCountReturning(returningCustomersData.length);
        }, (error) => {
          console.error('Error retrieving returning customers:', error);
          setReturningCustomers([]);
          setCountReturning(0);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching returning customers:', error);
        setReturningCustomers([]);
        setCountReturning(0);
      }
    };

    fetchReturningCustomers();
  }, []);

  return { customers: returningCustomers, countReturning };
};

export default useFetchReturningCustomers;
