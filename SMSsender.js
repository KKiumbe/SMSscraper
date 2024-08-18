import axios from 'axios';
import { SMS_API_ENDPOINT, SMS_API_KEY, PARTNER_ID, SHORTCODE, TOKEN } from '@env';

// Function to format the phone number
const formatPhoneNumber = (number) => {
  if (number.startsWith('+254')) {
    return `254${number.slice(4)}`; // Remove '+254' and replace it with '254'
  } else if (number.startsWith('254')) {
    return number; // Return as is if it already starts with '254'
  } else if (number.startsWith('0')) {
    return `254${number.slice(1)}`; // Replace '0' with '254'
  }
  // Handle any other cases if necessary, otherwise return the number as is
  return number;
};



// Function to send SMS via the API
const sendSmsToApi = async (smsDetails) => {
  try {
    // Format the phone number
    const formattedPhoneNumber = formatPhoneNumber(smsDetails.phoneNumber);

    const response = await axios.post(SMS_API_ENDPOINT, {
     apikey: SMS_API_KEY,
      partnerID: PARTNER_ID,
      message: `Hi ${smsDetails.name}, we received your payment of ${smsDetails.amountPaid}. Enyoy 2 cheese burgers with fries @ 1199 and Two large loaded fries @ 1000 daily. Call 0741549463 to order`,
      shortcode: SHORTCODE,
      mobile: formattedPhoneNumber,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      }
    });

    if (response.data.responses[0]["response-code"] !== 200) {
      const errorDetails = response.data;
      console.error('Error response from SMS API:', errorDetails);
      throw new Error(`SMS API returned an error: ${response.status}`);
    }

    console.log(`SMS sent successfully to ${formattedPhoneNumber}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${smsDetails.phoneNumber}:`, error);
  }
};

// Exporting the function as default
export default sendSmsToApi;
