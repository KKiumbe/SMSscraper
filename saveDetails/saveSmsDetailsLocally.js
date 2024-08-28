import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the function
const saveSmsDetailsLocally = async (data) => {
  try {
    // Check if the data object has a phone number
    if (!data.phoneNumber) {
      console.log('No phone number found. Data not saved.');
      return; // Exit the function if phone number is missing
    }

    // Fetch existing data from AsyncStorage
    const existingDataJson = await AsyncStorage.getItem('SmsDetails');
    const existingData = JSON.parse(existingDataJson) || [];

    // Extract phone number and name from the input data
    const { phoneNumber, name } = data;

    // Check if the phone number already exists
    const phoneNumberExists = existingData.some(item => item.phoneNumber === phoneNumber);

    if (phoneNumberExists) {
      console.log('Phone number already exists. Data not saved.');
      return; // Exit the function if phone number exists
    }

    // Add new data if phone number does not exist
    existingData.push({ phoneNumber, name });
    await AsyncStorage.setItem('SmsDetails', JSON.stringify(existingData));
    console.log('Customer record saved locally!');
  } catch (error) {
    console.error('Error saving data locally:', error);
  }
};

// Export the function as default
export default saveSmsDetailsLocally;
