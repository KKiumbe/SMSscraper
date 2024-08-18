// Function to extract SMS details
const extractSmsDetails = (messageBody) => {
  // Convert the entire message body to uppercase
  const uppercasedMessageBody = messageBody.toUpperCase();

  // Define regular expressions
  const amountRegex = /KSH(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  const namePhoneRegex = /FROM ([A-Z\s]+) (\+?\d{9,12})/;

  // Match the amount and name/phone number
  const amountMatch = uppercasedMessageBody.match(amountRegex);
  const namePhoneMatch = uppercasedMessageBody.match(namePhoneRegex);

  // Extract details or default to 'N/A'
  const amountPaid = amountMatch ? amountMatch[1] : 'N/A';
  let name = namePhoneMatch ? namePhoneMatch[1].trim() : 'N/A';
  let phoneNumber = namePhoneMatch ? namePhoneMatch[2] : 'N/A';

  // No need to split name into first and last names
  console.log(`${amountPaid} , ${name}, ${phoneNumber}`);
  
  return {
    amountPaid,
    name,          // Single name field
    phoneNumber,
  };
};

// Exporting the function as default
export default extractSmsDetails;
