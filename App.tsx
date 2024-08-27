import React, { useEffect,useState } from 'react';
import { Platform, PermissionsAndroid, Alert, Linking, Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SmsListener from 'react-native-android-sms-listener'
//import SmsAndroid from 'react-native-get-sms-android';

import useStore from './store /useStore';
import extractSmsDetails from './saveDetails/extractSmsDetails';
import sendSmsToApi from './SMSsender';
import saveTransactionToFirestore from './saveDetails/saveTransactions';
import saveSmsDetailsLocally from './saveDetails/saveSmsDetailsLocally';
import uploadPendingData from './saveDetails/uploadPendingData';
import Payments from './views/Payments';
import Dashboard from './views/Dashboard';
import getSmsDetailsFromLocalStorage from './fetchData/getSmsDetailsFromLocalStorage';
import readSms from './ReadAllSMS';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
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
  const { setExtractedData } = useStore((state) => state);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const requestSmsPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            PermissionsAndroid.PERMISSIONS.READ_SMS,
          ];

          const granted = await PermissionsAndroid.requestMultiple(permissions);
          if (
            granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('SMS permissions granted');
          } else {
            console.log('SMS permissions denied');
          }
        } catch (err) {
          console.warn('Permission request error:', err);
        }
      }
    };

    const handleSmsReceived = async (message) => {
      console.log('Received SMS:', message);
      const { body, originatingAddress } = message;

      // Filter SMS by specified addresses
      if (originatingAddress === 'MPESA' || originatingAddress === '+16505556789') {
        try {
          const extractedData = extractSmsDetails(body);
          console.log('Extracted Data:', extractedData);

          // Store the extracted data in global state
        
          setExtractedData(extractedData);
          console.log(`the extracted data  is  ${extractedData}`)

          // Perform async actions after extracting data
         // await sendSmsToApi(extractedData);
          await saveTransactionToFirestore(extractedData);
          await saveSmsDetailsLocally(extractedData);
          await uploadPendingData();
        } catch (err) {
          console.error('Error extracting data:', err);
        }
      }
    };

    const pollLocalStorage = async () => {
      try {
        const pendingSmsDetails = await getSmsDetailsFromLocalStorage();
        if (pendingSmsDetails.length > 0) {
          for (const data of pendingSmsDetails) {
            //await sendSmsToApi(data);
            await saveTransactionToFirestore(data);
            await uploadPendingData();
          }
        }
      } catch (err) {
        console.error('Error polling local storage:', err);
      }
    };

    requestSmsPermission();

    const subscription = SmsListener.addListener(handleSmsReceived);

    // Set interval to poll local storage every minute
    const intervalId = setInterval(pollLocalStorage, 60000);

    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [setExtractedData]);

  const handleSyncPress = async () => {
    // Check for permission before trying to read SMS
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    
    if (hasPermission) {
      setIsSyncing(true);

      try {
        const extractedDataList = await readSms();  // Read SMS and get extracted data

        // Perform operations on the extracted data
        for (const extractedData of extractedDataList) {
         // await sendSmsToApi(extractedData);
          await saveTransactionToFirestore(extractedData);
          await saveSmsDetailsLocally(extractedData);
          await uploadPendingData();
        }

        // Update extractedData in the Zustand store
        setExtractedData(extractedDataList);

      } catch (error) {
        console.error('Error during SMS sync operations:', error);
      } finally {
        setIsSyncing(false);
      }

    } else {
      console.log('Permission to read SMS not granted.');
      Alert.alert(
        'Permission Required',
        'This app needs permission to read SMS messages.',
        [{ text: 'OK', onPress: () => requestSmsPermission() }],
        { cancelable: false }
      );
    }
  };

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

      <View style={{ padding: 20 }}>
        <Button
          title={isSyncing ? 'Syncing...' : 'Sync SMS'}
          onPress={handleSyncPress}
          disabled={isSyncing}
        />
      </View>
    </NavigationContainer>
  );
};

export default App;
