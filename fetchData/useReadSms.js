import useStore from "../store /useStore";

export const readText = () => {
  useEffect(() => {
    const { setExtractedData } = useStore.getState();

    const requestSmsPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            {
              title: 'SMS Permission',
              message: 'This app needs access to receive SMS messages.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('SMS receive permission granted');
          } else {
            console.log('SMS receive permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestSmsPermission();

    const subscription = SmsListener.addListener(async (message) => {
      console.log('Received SMS:', message);
      const messageBody = message.body;

      const extractedData = extractSmsDetails(messageBody);
      console.log('Extracted Data:', extractedData);

      // Store the extracted data in global state
      setExtractedData(extractedData);

      
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
