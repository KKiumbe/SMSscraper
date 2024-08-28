import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const saveTransactionToFirestore = async (data) => {
  if (!data || !data.transactionCode) {
    console.error('Invalid data: Data is null or missing transactionCode.');
    return;
  }

  try {
    const transactionsCollectionRef = collection(db, 'Transactions');
    
    // Check if transaction with the same transactionCode already exists
    const q = query(transactionsCollectionRef, where('transactionCode', '==', data.transactionCode));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Transaction with this transactionCode already exists.');
      return;
    }

    // Save the transaction
    await addDoc(transactionsCollectionRef, {
      ...data,
      timestamp: new Date().getTime(),  // Store the timestamp in milliseconds
    });

    // Save the new customer to a monthly collection
    await addNewCustomerToMonthlyCollection(data);

    console.log('Transaction saved successfully!');
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

const addNewCustomerToMonthlyCollection = async (data) => {
  if (!data || !data.phoneNumber) {
    console.error('Invalid data: Data is null or missing phoneNumber.');
    return;
  }

  try {
    const now = new Date();
    const month = now.getMonth() + 1; // Months are 0-based, so add 1 to get 1-based month
    const year = now.getFullYear();

    // Create a collection name based on the current month and year
    const collectionName = `NewCustomers_${year}_${month}`;
    const newCustomersCollectionRef = collection(db, collectionName);

    // Check if the customer already exists in the monthly collection
    const q = query(newCustomersCollectionRef, where('phoneNumber', '==', data.phoneNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Add a new document with customer details
      await addDoc(newCustomersCollectionRef, {
        phoneNumber: data.phoneNumber,
        name: data.name,
        addedAt: new Date(),  // Store the timestamp of addition
      });
      console.log('New customer added to monthly collection.');
    } else {
      console.log('Customer with this phone number already exists in the monthly collection.');
    }
  } catch (error) {
    console.error('Error adding new customer to monthly collection:', error);
  }
};

export default saveTransactionToFirestore;
