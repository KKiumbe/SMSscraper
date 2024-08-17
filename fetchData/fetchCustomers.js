import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Ensure the path to your firebaseConfig is correct

// Function to fetch total count of all saved contacts
const fetchCustomerCount = async () => {
  try {
    const allContactsQuery = collection(db, 'smsDetails');
    const allContactsSnapshot = await getDocs(allContactsQuery);
    return allContactsSnapshot.size;
  } catch (error) {
    console.error('Error fetching customer count:', error);
    return 0; // Return 0 in case of an error
  }
};

// Function to fetch new customers added in the last 30 days
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
    return newCustomersSnapshot.size;
  } catch (error) {
    console.error('Error fetching new customers:', error);
    return 0; // Return 0 in case of an error
  }
};

// Export both functions
export { fetchCustomerCount, fetchNewCustomers };
