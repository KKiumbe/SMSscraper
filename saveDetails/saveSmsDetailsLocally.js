import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the function
const saveSmsDetailsLocally = async (data) => {
  try {
    const existingData = JSON.parse(await AsyncStorage.getItem('SmsDetails')) || [];
    existingData.push(data);
    await AsyncStorage.setItem('pendingSmsDetails', JSON.stringify(existingData));
    console.log('SMS details saved locally!');
  } catch (error) {
    console.error('Error saving data locally:', error);
  }
};

// Export the function as default
export default saveSmsDetailsLocally;
