import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { getAccountBalance } from '../../sendSMS/fetchAccountBalance'; // Import your function

const AccountBalance = () => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const data = await getAccountBalance();
      console.log(data)
      // Adjust based on actual API response structure
      setBalance(data.credit || 'No balance information available');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch account balance.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);


  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Balance</Title>
          <Paragraph style={styles.balance}>
            {isLoading ? 'Loading...' : `${balance} SMS units`}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={fetchBalance}
            disabled={isLoading}
            color="tomato"
          >
            Refresh Balance
          </Button>
        </Card.Actions>
      </Card>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  balance: {
    fontSize: 16,
    marginVertical: 16,
    color: 'green',
  },
  supportContainer: {
    marginTop: 16,
  },
});

export default AccountBalance;
