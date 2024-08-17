// Function to extract SMS details
const extractSmsDetails = (messageBody) => {
  const amountRegex = /Ksh(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  const namePhoneRegex = /from ([A-Z\s]+) (\+?\d{9,12})/;

  const amountMatch = messageBody.match(amountRegex);
  const namePhoneMatch = messageBody.match(namePhoneRegex);

  const amountPaid = amountMatch ? amountMatch[1] : 'N/A';
  let name = namePhoneMatch ? namePhoneMatch[1].trim() : 'N/A';
  let phoneNumber = namePhoneMatch ? namePhoneMatch[2] : 'N/A';

  name = name ? name.toUpperCase() : 'N/A';



  // Split name into first and last names
  let firstName = 'N/A';
  let lastName = 'N/A';
  const nameParts = name.split(' ');

  if (nameParts.length > 0) {
    firstName = nameParts[0];
  }

  if (nameParts.length > 1) {
    lastName = nameParts[nameParts.length - 1];
  }

  return {
    amountPaid,
    firstName,
    lastName,
    phoneNumber,
  };
};

// Exporting the function as default
export default extractSmsDetails;