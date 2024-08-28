import axios from 'axios';
import Config from 'react-native-config';

// Function to get account balance
export const getAccountBalance = async () => {
  try {
    const response = await axios.get('https://quicksms.advantasms.com/api/services/getbalance/', {
      params: {
        apikey: Config.SMS_API_KEY,
        partnerID: Config.PARTNER_ID,
      }
    });
    return response.data; // Adjust based on actual API response structure
  } catch (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
};

