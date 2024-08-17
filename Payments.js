import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text, ScrollView } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network status
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import sendSmsToApi from './SMSsender';

import extractSmsDetails from './extractSmsDetails';
import uploadPendingData from './uploadPendingData';
import saveSmsDetailsLocally from './saveSmsDetailsLocally';
import saveTransactionToFirestore from './saveTransactions';
import Transaction from './componets/transactions';


const Payments  = () => {
  const [smsDetails, setSmsDetails] = useState([]);

  useEffect(() => {
    const requestSmsPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            {
              title: 'SMS Permission',
              message: 'This app needs access to receive SMS messages.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('SMS receive permission granted');
          } else {
            console.log('SMS receive permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestSmsPermission();

    // Check if there is any unsent data in AsyncStorage and try to upload it
    uploadPendingData();

    const subscription = SmsListener.addListener(async (message) => {
      console.log('Received SMS:', message);
      const messageBody = message.body;

      const extractedData = extractSmsDetails(messageBody);
      console.log('Extracted Data:', extractedData);

      setSmsDetails((prevDetails) => [extractedData, ...prevDetails]);

      await saveTransactionToFirestore(extractedData);

      await sendSmsToApi(extractedData);

      // Save data locally first
      await saveSmsDetailsLocally(extractedData);

      // Attempt to upload to Firestore
      await uploadPendingData();
    
    });

    return () => {
      subscription.remove();
    };
  }, []);




  return (
    <ScrollView>
   <Transaction/>
    </ScrollView>
  );
};

export default Payments;