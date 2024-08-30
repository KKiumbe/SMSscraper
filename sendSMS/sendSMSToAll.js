import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';


import { SMS_API_KEY, PARTNER_ID, SHORTCODE } from '@env';
import useFetchCustomerCount from '../fetchData/useFetchCustomerCount';
import { sendBulkSmsToAPI} from './sendBulkSMSToAPI';
import AccountBalance from '../componets/accountBalance/AccountBalance';
import { TextInput } from 'react-native-paper';


const SendBulkSms = () => {
  const [smsContent, setSmsContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);

  // Fetch all customers
  const { customers: allCustomers } = useFetchCustomerCount();

  useEffect(() => {
    setCustomerCount(allCustomers.length);
  }, [allCustomers]);

  const handleSendSms = async () => {
    if (smsContent.trim() === '') {
      Alert.alert('Error', 'Please enter SMS content.');
      return;
    }

    // Create SMS list
    const smsList = allCustomers.map((customer, index) => ({
      partnerID: PARTNER_ID,
      apikey: SMS_API_KEY,
      pass_type: 'plain',
      clientsmsid: index + 1,
      mobile: customer.phoneNumber.startsWith('0')
        ? `254${customer.phoneNumber.slice(1)}`
        : customer.phoneNumber,
      message: smsContent.replace('{name}', customer.name),
      shortcode: SHORTCODE,
    }));

    const requestBody = {
      count: smsList.length,
      smslist: smsList,
    };

    setIsSending(true);

    try {
      await sendBulkSmsToAPI(requestBody); // Use the updated sendBulkSms function
      Alert.alert('Success', 'SMS sent to all customers.');
    } catch (error) {
      Alert.alert('Error', `Failed to send SMS: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <AccountBalance />
      <Text style={styles.title}>SMS all Your Clients</Text>

      <TextInput
        mode="outlined"
        label="SMS Content"
        placeholder="Type your message here with {name} for customer's name..."
        multiline
        numberOfLines={12}
        value={smsContent}
        onChangeText={setSmsContent}
        style={styles.input}
      />

      <Text style={styles.count}>
        Number of customers to receive SMS: {customerCount}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isSending ? 'Sending...' : 'Send SMS'}
          onPress={handleSendSms}
          disabled={isSending}
          color='#4CAF50' // Light Green
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12, // Reduced margin to bring elements closer
  },
  input: {
    marginBottom: 12, // Reduced margin to bring elements closer
  },
  count: {
    fontSize: 16,
    marginVertical: 8,
    color: 'green',
  },
  buttonContainer: {
    marginTop: 16, // Reduced space above the button
  },
});

export default SendBulkSms;
