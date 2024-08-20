// Define the function
const removeSmsDetailsFromLocalStorage = async (dataToRemove) => {
    try {
      let existingData = JSON.parse(await AsyncStorage.getItem('SmsDetails')) || [];
      existingData = existingData.filter(data => data !== dataToRemove); // Remove specific data
      await AsyncStorage.setItem('SmsDetails', JSON.stringify(existingData));
      console.log('SMS details removed from local storage!');
    } catch (error) {
      console.error('Error removing data from local storage:', error);
    }
  };
  
  // Export the function as default
  export default removeSmsDetailsFromLocalStorage;
  