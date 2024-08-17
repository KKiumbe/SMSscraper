import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure the path to your firebaseConfig is correct

// Function to fetch the count of all saved contacts from Firestore
const fetchCustomerCount = async () => {
  try {
    // Reference to the 'smsDetails' collection
    const customersCollectionRef = collection(db, 'smsDetails');

    // Fetch documents from the collection
    const snapshot = await getDocs(customersCollectionRef);

    // Return the count of documents
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching customer count:', error);
    return 0; // Return 0 in case of an error
  }
};

export default fetchCustomerCount;
