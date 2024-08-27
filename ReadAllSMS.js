import SmsAndroid from 'react-native-get-sms-android';
import extractSmsDetails from './saveDetails/extractSmsDetails';
import requestSmsPermission from './config/requestSmsPermission';

const readSms = async () => {
  if (!(await requestSmsPermission())) {
    console.log('Read SMS permission denied');
    return [];
  }

  return new Promise((resolve, reject) => {
    const filter = {
      box: 'inbox', // Only read messages from inbox
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
        reject(fail);
      },
      (count, smsList) => {
        console.log('Count: ', count);
        const arr = JSON.parse(smsList);

        const filteredSms = arr.filter((sms) =>
          sms.address === 'MPESA' || sms.address === '+1 650 5556789'
        );

        const allExtractedData = filteredSms.map((sms) => {
          console.log('Filtered SMS:', sms);
          const extractedData = extractSmsDetails(sms.body);
          console.log('Extracted Data:', extractedData);
          return extractedData;
        });

        resolve(allExtractedData);
      }
    );
  });
};

export default readSms;
