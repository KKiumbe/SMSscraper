// Function to extract SMS details
const extractSmsDetails = (messageBody) => {
  // Convert the entire message body to uppercase
  const uppercasedMessageBody = messageBody.toUpperCase();

  // Check if the message is a payment transaction
  if (!uppercasedMessageBody.includes('RECEIVED') || !uppercasedMessageBody.includes('FROM')) {
    console.log('Message is not a payment received transaction.');
    return null; // Or return an empty object if preferred
  }

  // Define regular expressions
  const transactionCodeRegex = /^[A-Z0-9]{10}/; // Matches the transaction code at the beginning of the message
  const amountRegex = /KSH\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/; // Handles amount with commas and decimals, with no leading spaces
  const phoneNumberRegex = /\b(\+?\d{10,15})\b/; // Matches phone numbers with 10 to 15 digits, optionally starting with +

  // Extract the part of the message before 'RECEIVED' to find the amount
  const beforeReceivedPart = uppercasedMessageBody.split('RECEIVED')[0] || '';

  // Match the amount before 'RECEIVED'
  const amountMatch = beforeReceivedPart.match(amountRegex);

  // Extract the part of the message after 'RECEIVED' to simplify extraction
  const afterReceivedPart = uppercasedMessageBody.split('RECEIVED')[1] || '';

  // Fix for concatenated 'AM'/'PM' with time
  const fixedPart = afterReceivedPart.replace(/(\d{1,2}:\d{2})(AM|PM)/g, '$1 $2').trim();

  // Match the transaction code and phone number
  const transactionCodeMatch = uppercasedMessageBody.match(transactionCodeRegex);
  const phoneNumberMatch = uppercasedMessageBody.match(phoneNumberRegex);

  // Extract phone number and name from the portion before the period
  let phoneNumber = phoneNumberMatch ? phoneNumberMatch[0] : 'N/A';
  let name = 'N/A';

  if (phoneNumber) {
    // Find the index of the phone number and the period after it
    const phoneNumberIndex = uppercasedMessageBody.indexOf(phoneNumber);
    const textAfterPhone = uppercasedMessageBody.substring(phoneNumberIndex + phoneNumber.length);
    const periodIndex = textAfterPhone.indexOf('.');
    
    if (periodIndex !== -1) {
      // Extract name as the text between the phone number and the period
      name = textAfterPhone.substring(0, periodIndex).trim();
    }
  }

  // Function to get current time in HH:MM AM/PM format
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + strMinutes + ' ' + ampm;
  };

  // Extract details or default to 'N/A'
  const transactionCode = transactionCodeMatch ? transactionCodeMatch[0] : 'N/A';
  const amountPaid = amountMatch ? amountMatch[1] : 'N/A';
  const currentTime = getCurrentTime();

  // Log the extracted details
  console.log(`Transaction Code: ${transactionCode}, Amount: ${amountPaid}, Name: ${name}, Phone Number: ${phoneNumber}, Time Paid: ${currentTime}`);
  
  return {
    transactionCode,
    amountPaid,
    name,          // Single name field
    phoneNumber,
    timePaid: currentTime, // Current time instead of extracted time
  };
};

// Exporting the function as default
export default extractSmsDetails;
