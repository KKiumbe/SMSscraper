import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const saveTransactionToFirestore = async (data) => {
  try {
    // Save the transaction
    const transactionsCollectionRef = collection(db, 'Transactions');
    await addDoc(transactionsCollectionRef, {
      ...data,
      timestamp: new Date().getTime(),  // Store the timestamp in milliseconds
    });

    // Save the new customer to a monthly collection
    await addNewCustomerToMonthlyCollection(data);

    console.log('Transaction and new customer saved successfully!');
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

const addNewCustomerToMonthlyCollection = async (data) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // Months are 0-based, so add 1 to get 1-based month
    const year = now.getFullYear();

    // Create a collection name based on the current month and year
    const collectionName = `NewCustomers_${year}_${month}`;
    const newCustomersCollectionRef = collection(db, collectionName);

    const phoneNumber = data.phoneNumber;

    // Add a new document with customer details
    await addDoc(newCustomersCollectionRef, {
      phoneNumber: phoneNumber,
      name: data.name,
      addedAt: new Date(),  // Store the timestamp of addition
    });
  } catch (error) {
    console.error('Error adding new customer to monthly collection:', error);
  }
};

export default saveTransactionToFirestore;
