import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';  // Your Firestore configuration

const saveTransactionToFirestore = async (data) => {
  try {
    const transactionsCollectionRef = collection(db, 'Transactions');
    await addDoc(transactionsCollectionRef, {
      ...data,
      timestamp: new Date().getTime(),  // Store the timestamp in milliseconds
    });
    console.log('Transaction saved successfully!');
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

export default saveTransactionToFirestore;
