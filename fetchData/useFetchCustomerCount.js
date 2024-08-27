import { useState, useEffect } from 'react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'customerData';

const useFetchCustomerCount = () => {
  const [customerData, setCustomerData] = useState({ count: 0, customers: [] });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'smsDetails'),
      async (snapshot) => {
        try {
          const customers = snapshot.docs.map(doc => ({
            id: doc.id, // Include the document ID for updates
            name: doc.data().name,
            phoneNumber: doc.data().phoneNumber
          }));

          // Store data locally
          await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            count: snapshot.size,
            customers: customers
          }));

          setCustomerData({
            count: snapshot.size,
            customers: customers
          });
        } catch (error) {
          console.error('Error processing snapshot data:', error);

          // Load data from local storage if error occurs
          const localData = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            setCustomerData(JSON.parse(localData));
          } else {
            setCustomerData({ count: 0, customers: [] });
          }
        }
      },
      (error) => {
        console.error('Error with snapshot listener:', error);

        // Load data from local storage if snapshot listener fails
        const localData = AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          setCustomerData(JSON.parse(localData));
        } else {
          setCustomerData({ count: 0, customers: [] });
        }
      }
    );

    // Cleanup the listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return customerData;
};

export default useFetchCustomerCount;
