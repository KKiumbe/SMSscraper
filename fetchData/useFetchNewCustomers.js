import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const useFetchNewCustomersCount = () => {
  const [countNewCustomers, setCountNewCustomers] = useState(0);

  useEffect(() => {
    const fetchNewCustomersCount = async () => {
      try {
        // Get current month and year
        const now = new Date();
        const month = now.getMonth() + 1; // Months are 0-based, so +1 for human-readable month
        const year = now.getFullYear();   // Current year

        // Format collection name
        const collectionName = `NewCustomers_${year}_${month}`;
        const newCustomersCollectionRef = collection(db, collectionName);
        const q = query(newCustomersCollectionRef);

        // Fetch documents with getDocs
        const querySnapshot = await getDocs(q);

        // Log the size of the snapshot
        console.log("Snapshot size:", querySnapshot.size);

        // Set the count of new customers
        setCountNewCustomers(querySnapshot.size);

      } catch (error) {
        console.error('Error fetching new customers count:', error);
        setCountNewCustomers(0); // Set count to 0 on error
      }
    };

    fetchNewCustomersCount();
  }, []); // Empty dependency array means this effect runs once on component mount

  return countNewCustomers;
};

export default useFetchNewCustomersCount;
