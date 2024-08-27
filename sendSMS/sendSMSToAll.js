import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import useFetchNewCustomers from '../fetchData/useFetchNewCustomers';
import useFetchReturningCustomers from '../fetchData/useFetchReturningCustomers';
import useFetchCustomerCount from '../fetchData/useFetchCustomerCount';
import { SMS_API_KEY, PARTNER_ID, SHORTCODE } from '@env';
import { sendSmsViaApi } from './sendBulkSMSToAPI';
import GroupSelector from './GroupSelector';



const SendBulkSms = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [smsContent, setSmsContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);

  const { customers: newCustomers } = useFetchNewCustomers('new');
  const { customers: returningCustomers } = useFetchReturningCustomers('returning');
  const { customers: allCustomers } = useFetchCustomerCount('all');

  useEffect(() => {
    if (selectedGroup) {
      let count = 0;
      if (selectedGroup.id === 'all') {
        count = allCustomers.length;
      } else if (selectedGroup.id === 'new') {
        count = newCustomers.length;
      } else if (selectedGroup.id === 'returning') {
        count = returningCustomers.length;
      }
      setCustomerCount(count);
    }
  }, [selectedGroup, newCustomers, returningCustomers, allCustomers]);

  const handleSendSms = async () => {
    if (!selectedGroup || smsContent.trim() === '') {
      Alert.alert('Error', 'Please select a group and enter SMS content.');
      return;
    }

    let customersToContact = [];

    if (selectedGroup.id === 'all') {
      customersToContact = allCustomers;
    } else if (selectedGroup.id === 'new') {
      customersToContact = newCustomers;
    } else if (selectedGroup.id === 'returning') {
      customersToContact = returningCustomers;
    }

    const smsList = customersToContact.map((customer, index) => ({
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
      await sendSmsViaApi(requestBody);
      Alert.alert('Success', 'SMS sent to selected group.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send SMS.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Bulk SMS</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your message here with {name} for customer's name..."
        multiline
        numberOfLines={4}
        value={smsContent}
        onChangeText={setSmsContent}
      />

      <Text style={styles.subtitle}>Select Group:</Text>
      <GroupSelector
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      {selectedGroup && (
        <Text style={styles.count}>
          Number of customers to receive SMS: {customerCount}
        </Text>
      )}

      <Button
        title={isSending ? 'Sending...' : 'Send SMS'}
        onPress={handleSendSms}
        disabled={isSending}
        color='tomato'
      />
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    textAlignVertical: 'top',
  },
  count: {
    fontSize: 16,
    marginVertical: 8,
    color: 'green',
  },
});

export default SendBulkSms;
