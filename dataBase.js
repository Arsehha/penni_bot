// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBZhalv8DUyscWl1dvs5mk6hkfc7MvsmA4",
    authDomain: "pennibot-254f6.firebaseapp.com",
    projectId: "pennibot-254f6",
    storageBucket: "pennibot-254f6.appspot.com",
    messagingSenderId: "520844607032",
    appId: "1:520844607032:web:d98ed5c589bc33cd8fb0cd",
    measurementId: "G-633LDVBYC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

module.exports = app