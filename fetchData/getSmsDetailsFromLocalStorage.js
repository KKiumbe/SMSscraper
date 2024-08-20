import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the function
const getSmsDetailsFromLocalStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('SmsDetails');
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      return [];
    }
  };
  
  // Export the function as default
  export default getSmsDetailsFromLocalStorage;
  