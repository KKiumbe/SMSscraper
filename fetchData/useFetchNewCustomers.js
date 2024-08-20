import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const useFetchNewCustomers = () => {
  const [newCustomers, setNewCustomers] = useState(0);

  useEffect(() => {
    const fetchNewCustomers = () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const allContactsQuery = collection(db, 'smsDetails');
      const newCustomersQuery = query(
        allContactsQuery,
        where('timestamp', '>=', Timestamp.fromDate(startOfMonth)),
        where('timestamp', '<=', Timestamp.fromDate(endOfMonth))
      );

      const unsubscribe = onSnapshot(newCustomersQuery, (snapshot) => {
        setNewCustomers(snapshot.size);
      }, (error) => {
        console.error('Error fetching new customers:', error);
        setNewCustomers(0);
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    };

    fetchNewCustomers();
  }, []);

  return newCustomers;
};

export default useFetchNewCustomers;
