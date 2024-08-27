// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBUJdXAABoRFDQKXcAxFfVWRligZYKZCwk",
  authDomain: "phone-app-70c33.firebaseapp.com",
  projectId: "phone-app-70c33",
  storageBucket: "phone-app-70c33.appspot.com",
  messagingSenderId: "273327664875",
  appId: "1:273327664875:android:334dde44aabff1bd5a98ae", // Make sure this matches your actual appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
