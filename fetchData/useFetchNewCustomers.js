import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const useFetchNewCustomers = () => {
  const [newCustomers, setNewCustomers] = useState(0);

  useEffect(() => {
    const fetchNewCustomers = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const allContactsQuery = collection(db, 'smsDetails');
        const newCustomersQuery = query(
          allContactsQuery,
          where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo))
        );

        const newCustomersSnapshot = await getDocs(newCustomersQuery);
        setNewCustomers(newCustomersSnapshot.size);
      } catch (error) {
        console.error('Error fetching new customers:', error);
        setNewCustomers(0);
      }
    };

    fetchNewCustomers();
  }, []);

  return newCustomers;
};

export default useFetchNewCustomers;
