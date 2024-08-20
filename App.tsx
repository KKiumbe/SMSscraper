import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SmsListener from 'react-native-android-sms-listener';
import useStore from './store /useStore';
import extractSmsDetails from './saveDetails/extractSmsDetails';
import sendSmsToApi from './SMSsender';
import saveTransactionToFirestore from './saveDetails/saveTransactions';
import saveSmsDetailsLocally from './saveDetails/saveSmsDetailsLocally';
import uploadPendingData from './saveDetails/uploadPendingData';
import Payments from './views/Payments';
import Dashboard from './views/Dashboard';
import getSmsDetailsFromLocalStorage from './fetchData/getSmsDetailsFromLocalStorage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={Dashboard} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="Transaction" 
      component={Payments} 
      options={{ headerBackTitleVisible: false, title: 'Back' }} 
    />
  </Stack.Navigator>
);

const App = () => {
  const { setExtractedData} = useStore((state) => state);

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
          console.warn('Permission request error:', err);
        }
      }
    };
  
    const handleSmsReceived = async (message) => {
      console.log('Received SMS:', message);
      const messageBody = message.body;
  
      try {
        const extractedData = extractSmsDetails(messageBody);
        console.log('Extracted Data:', extractedData);
  
        // Store the extracted data in global state
        setExtractedData(extractedData);
  
        // Perform async actions after extracting data
        await sendSmsToApi(extractedData);
        await saveTransactionToFirestore(extractedData);
        await saveSmsDetailsLocally(extractedData);
        await uploadPendingData();
  
      } catch (err) {
        console.error('Error extracting data:', err);
      }
    };
  
    requestSmsPermission();
  
    const subscription = SmsListener.addListener(handleSmsReceived);
  
    // Polling function to process unprocessed SMS details
    const pollLocalStorage = async () => {
      try {
        const pendingSmsDetails = await getSmsDetailsFromLocalStorage();
        if (pendingSmsDetails) {
          for (const data of pendingSmsDetails) {
            await sendSmsToApi(data);
            await saveTransactionToFirestore(data);
            await uploadPendingData();
          }
        }
      } catch (err) {
        console.error('Error polling local storage:', err);
      }
    };
  
    // Set interval to poll local storage every minute
    const intervalId = setInterval(pollLocalStorage, 60000);
  
    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [setExtractedData]);
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Payments') {
              iconName = 'list';
            }
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Payments" component={Payments} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;