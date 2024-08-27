import { PermissionsAndroid, Platform } from 'react-native';

const requestSmsPermission = async () => {
  if (Platform.OS !== 'android') {
    return true; // Assume permission granted for non-Android platforms
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'Read SMS Permission',
        message: 'This app requires access to your SMS messages to function.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Error requesting SMS permission:', err);
    return false;
  }
};

export default requestSmsPermission;
