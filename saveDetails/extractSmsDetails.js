// Function to extract SMS details
const extractSmsDetails = (messageBody) => {
  // Convert the entire message body to uppercase
  const uppercasedMessageBody = messageBody.toUpperCase();

  // Check if the message is a payment transaction
  if (!uppercasedMessageBody.includes('RECEIVED') && !uppercasedMessageBody.includes('FROM')) {
    console.log('Message is not a payment received transaction.');
    return null; // Or return an empty object if preferred
  }

  // Define regular expressions
  const transactionCodeRegex = /^[A-Z0-9]{10}/; // Matches the transaction code at the beginning of the message
  const amountRegex = /KSH(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  const namePhoneRegex = /FROM ([A-Z\s]+) (\+?\d{9,12})/;
  const timePaidRegex = /ON \d{1,2}\/\d{1,2}\/\d{2} AT \d{1,2}:\d{2} (AM|PM)/; // Matches the date and time pattern

  // Match the transaction code, amount, name/phone number, and time paid
  const transactionCodeMatch = uppercasedMessageBody.match(transactionCodeRegex);
  const amountMatch = uppercasedMessageBody.match(amountRegex);
  const namePhoneMatch = uppercasedMessageBody.match(namePhoneRegex);
  const timePaidMatch = uppercasedMessageBody.match(timePaidRegex);

  // Extract details or default to 'N/A'
  const transactionCode = transactionCodeMatch ? transactionCodeMatch[0] : 'N/A';
  const amountPaid = amountMatch ? amountMatch[1] : 'N/A';
  let name = namePhoneMatch ? namePhoneMatch[1].trim() : 'N/A';
  let phoneNumber = namePhoneMatch ? namePhoneMatch[2] : 'N/A';
  const timePaid = timePaidMatch ? timePaidMatch[0] : 'N/A';

  // Log the extracted details
  console.log(`Transaction Code: ${transactionCode}, Amount: ${amountPaid}, Name: ${name}, Phone Number: ${phoneNumber}, Time Paid: ${timePaid}`);
  
  return {
    transactionCode,
    amountPaid,
    name,          // Single name field
    phoneNumber,
    timePaid,
  };
};

// Exporting the function as default
export default extractSmsDetails;
