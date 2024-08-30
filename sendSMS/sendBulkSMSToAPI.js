import axios from 'axios';
import Config from 'react-native-config';

// Function to send SMS via API in batches
export const sendBulkSmsToAPI = async (requestBody) => {
  const BATCH_SIZE = 15; // Maximum number of messages per API call
  const smsList = requestBody.smslist;
  const totalMessages = smsList.length;
  const totalBatches = Math.ceil(totalMessages / BATCH_SIZE);

  console.log(`Starting to send SMS to ${totalMessages} contacts in ${totalBatches} batches.`);

  for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
    // Create a batch of SMS messages
    const batch = smsList.slice(batchNumber * BATCH_SIZE, (batchNumber + 1) * BATCH_SIZE);

    // Prepare the request body for this batch
    const batchRequestBody = { ...requestBody, smslist: batch };

    try {
      const response = await axios.post(Config.BULK_SMS_ENDPOINT, batchRequestBody);
      console.log(`Batch ${batchNumber + 1}/${totalBatches} sent.`);

      if (response.data.responses) {
        response.data.responses.forEach((res) => {
          if (res['response-code'] === 200) {
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
      // Optional: Implement retry logic or handle specific errors if needed
      throw error;
    }

    // Optional: Add delay between batches if required by the API rate limits
    // await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
