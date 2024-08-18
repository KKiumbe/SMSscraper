import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const useFetchCustomerCount = () => {
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const allContactsQuery = collection(db, 'smsDetails');
        const allContactsSnapshot = await getDocs(allContactsQuery);
        setCustomerCount(allContactsSnapshot.size);
      } catch (error) {
        console.error('Error fetching customer count:', error);
        setCustomerCount(0);
      }
    };

    fetchCustomerCount();
  }, []);

  return customerCount;
};

export default useFetchCustomerCount;
