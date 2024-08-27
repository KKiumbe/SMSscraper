import axios from 'axios';
import { BULK_SMS_ENDPOINT} from '@env';

// Function to send SMS via API
export const sendSmsViaApi = async (requestBody) => {
  try {
    const response = await axios.post(BULK_SMS_ENDPOINT, requestBody);

    if (response.data.responses) {
      response.data.responses.forEach((res) => {
        if (res['respose-code'] === 200) {
          console.log(`SMS sent to ${res.mobile}: Success`);
        } else {
          console.log(`Failed to send SMS to ${res.mobile}: ${res['response-description']}`);
        }
      });
    } else {
      console.error('Unexpected API response:', response.data);
      throw new Error('Unexpected API response');
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};
