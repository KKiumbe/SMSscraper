// ../fetchData/useFetchTransactions.js
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';


const useFetchTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transactionsCollectionRef = collection(db, 'Transactions');

    const unsubscribe = onSnapshot(
      transactionsCollectionRef,
      (snapshot) => {
        try {
          if (!snapshot.empty) {
            const transactionsArray = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTransactions(transactionsArray);
          } else {
            console.log('No transactions found.');
          }
        } catch (error) {
          setError(error);
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error);
        setLoading(false);
        console.error('Error subscribing to transactions:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { transactions, loading, error };
};

export default useFetchTransactions;
