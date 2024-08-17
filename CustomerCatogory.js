import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';  // Your Firestore configuration

const categorizeCustomer = async (phoneNumber, lowThreshold, averageThreshold, highThreshold) => {
  const transactionsCollectionRef = collection(db, 'monthlyTransactions');

  // Query to get the last 3 transactions for the customer
  const q = query(
    transactionsCollectionRef,
    where('phoneNumber', '==', phoneNumber),
    orderBy('timestamp', 'desc'),
    limit(3)
  );

  try {
    const querySnapshot = await getDocs(q);
    let totalAmount = 0;
    let count = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const amount = parseFloat(data.amountPaid.replace(/,/g, ''));
      totalAmount += amount;
      count++;
    });

    if (count === 0) {
      return "No transactions found.";
    }

    const averageAmount = totalAmount / count;
    let category = "";

    if (averageAmount > highThreshold) {
      category = "High Spenders";
    } else if (averageAmount > averageThreshold) {
      category = "Average Spenders";
    } else if (averageAmount > lowThreshold) {
      category = "Low Spenders";
    } else {
      category = "Very Low Spenders"; // Optional: Add another category if needed
    }

    return {
      averageAmount: averageAmount.toFixed(2),
      category
    };
  } catch (error) {
    console.error('Error analyzing customer spending:', error);
    return null;
  }
};

export default categorizeCustomer;
