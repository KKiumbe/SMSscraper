import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const uploadPendingData = async () => {
  const netInfo = await NetInfo.fetch();
  if (netInfo.isConnected) {
    try {
      const pendingData = JSON.parse(await AsyncStorage.getItem('SmsDetails')) || [];
      const smsCollectionRef = collection(db, 'smsDetails');

      for (let i = 0; i < pendingData.length; i++) {
        const sms = pendingData[i];
        const { phoneNumber } = sms;

        // Query Firestore to check if the phone number already exists
        const q = query(smsCollectionRef, where('phoneNumber', '==', phoneNumber));
        const querySnapshot = await getDocs(q);

        // Only upload if the phone number does not exist in Firestore
        if (querySnapshot.empty) {
          await addDoc(smsCollectionRef, sms);
          console.log('SMS details uploaded to Firestore:', sms);
        } else {
          console.log(`SMS details with phone number ${phoneNumber} already exist in Firestore.`);
        }
      }

      // Clear the pending data from local storage after successful upload
      await AsyncStorage.removeItem('pendingSmsDetails');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }
  } else {
    console.log('No internet connection. Data will be uploaded when the network is available.');
  }
};

// Exporting the function as default
export default uploadPendingData;
