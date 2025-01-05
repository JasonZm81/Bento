// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs8hrCHfKazUp1BLbJ7Vnme-beimDpojI",
  authDomain: "bento-99731.firebaseapp.com",
  projectId: "bento-99731",
  storageBucket: "bento-99731.firebasestorage.app",
  messagingSenderId: "831450069883",
  appId: "1:831450069883:web:19ab9c1f16eb69c75ddbde",
  measurementId: "G-0DL5D98X2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;