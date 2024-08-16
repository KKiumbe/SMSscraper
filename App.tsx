import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text, ScrollView } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import { db } from './firebaseConfig'; // Import your Firebase configuration
import { addDoc, firebase } from '@react-native-firebase/firestore';
import { collection } from '@firebase/firestore';

const App = () => {
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

    const subscription = SmsListener.addListener(async (message) => {
      console.log('Received SMS:', message);
      const messageBody = message.body;

      const extractedData = extractSmsDetails(messageBody);
      console.log('Extracted Data:', extractedData);

      await saveSmsDetailsToFirestore(extractedData);

      setSmsDetails((prevDetails) => [extractedData, ...prevDetails]);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const extractSmsDetails = (messageBody) => {
    const amountRegex = /Ksh(\d{1,3}(,\d{3})*(\.\d{2})?)/;
    const namePhoneRegex = /from ([A-Z\s]+) (\d{10})/;

    const amountMatch = messageBody.match(amountRegex);
    const namePhoneMatch = messageBody.match(namePhoneRegex);

    const amountPaid = amountMatch ? amountMatch[1] : 'N/A';
    let name = namePhoneMatch ? namePhoneMatch[1].trim() : 'N/A';
    const phoneNumber = namePhoneMatch ? namePhoneMatch[2] : 'N/A';

    name = name ? name.toUpperCase() : 'N/A';

    return {
      amountPaid,
      name,
      phoneNumber,
    };
  };

  const saveSmsDetailsToFirestore = async (data) => {
    try {
      const smsCollectionRef = collection(db, 'smsDetails');
      console.log(db);  // Should log a Firestore instance

      await addDoc(smsCollectionRef, {
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log('SMS details saved successfully!');
    } catch (error) {
      if (error.code === 'permission-denied') {
        console.error('Permission denied:', error);
      } else if (error.code === 'unavailable') {
        console.error('Firestore unavailable:', error);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  return (
    <ScrollView>
      {smsDetails.map((detail, index) => (
        <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text>Phone Number: {detail.phoneNumber}</Text>
          <Text>Name: {detail.name}</Text>
          <Text>Amount Paid: {detail.amountPaid}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default App;