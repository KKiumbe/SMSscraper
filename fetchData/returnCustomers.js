import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';  // For date manipulation
import { db } from '../config/firebaseConfig';

const getReturningCustomerCount = async () => {
  const transactionsCollectionRef = collection(db, 'Transactions');

  // Calculate the start and end dates for the current month
  const now = moment();
  const startOfMonth = now.startOf('month').toDate().getTime();
  const endOfMonth = now.endOf('month').toDate().getTime();

  // Query to get all transactions for the current month
  const q = query(
    transactionsCollectionRef,
    where('timestamp', '>=', startOfMonth),
    where('timestamp', '<=', endOfMonth)
  );

  try {
    const querySnapshot = await getDocs(q);
    const customerTransactionCount = {};

    // Count the number of transactions per customer
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const phoneNumber = data.phoneNumber;

      if (!customerTransactionCount[phoneNumber]) {
        customerTransactionCount[phoneNumber] = 0;
      }
      customerTransactionCount[phoneNumber]++;
    });

    // Count customers who have more than 2 transactions
    const returningCustomerCount = Object.values(customerTransactionCount).filter(count => count > 2).length;

    return returningCustomerCount;
  } catch (error) {
    console.error('Error retrieving returning customer count:', error);
    return 0;
  }
};

export default getReturningCustomerCount;
