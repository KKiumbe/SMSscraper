import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARDYjfGf1WQra4y0Ejb_VSrK2Dq7sJj30",
  authDomain: "maryas-7d141.firebaseapp.com",
  projectId: "maryas-7d141",
  storageBucket: "maryas-7d141.appspot.com",
  messagingSenderId: "158542716828",
  appId: "1:158542716828:android:d180b5990816c2f1e4b259",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
