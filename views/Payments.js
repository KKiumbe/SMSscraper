// Payments.js
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import saveTransactionToFirestore from '../saveDetails/saveTransactions';
import sendSmsToApi from '../SMSsender';
import saveSmsDetailsLocally from '../saveDetails/saveSmsDetailsLocally';
import uploadPendingData from '../saveDetails/uploadPendingData';
import extractSmsDetails from '../saveDetails/extractSmsDetails';
import useFetchTransactions from '../fetchData/useFetchTransactions';
import TransactionTable from '../componets/ TransactionTable';
import { Provider as PaperProvider } from 'react-native-paper';


const Payments = () => {
  const { transactions, loading, error } = useFetchTransactions();

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
      await sendSmsToApi(extractedData);

      // Save data directly
      await saveTransactionToFirestore(extractedData);
      await sendSmsToApi(extractedData);
      await saveSmsDetailsLocally(extractedData);
      await uploadPendingData();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return <SafeAreaView style={styles.container}><Text>Loading...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={styles.container}><Text>Error: {error.message}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
       <PaperProvider> 
       <TransactionTable transactions={transactions} />
         </PaperProvider>

 

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
});

export default Payments;
