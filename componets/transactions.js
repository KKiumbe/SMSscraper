const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Update with your JSON file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore reference

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle POST requests
app.post('/upload', async (req, res) => {
  try {
    const { phoneNumber, name } = req.body;

    // Ensure phoneNumber is provided
    if (!phoneNumber) {
      return res.status(400).send('Phone number is required');
    }

    // Define the document data
    const data = {
      phoneNumber: phoneNumber,
      name: name || 'N/A', // Default to 'N/A' if name is not provided
      createdAt: admin.firestore.FieldValue.serverTimestamp() // Add a timestamp
    };

    // Add the document to the 'smsDetails' collection
    const docRef = await db.collection('smsDetails').add(data);

    // Send a success response
    res.status(200).send(`Document written with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).send('Error adding document');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
