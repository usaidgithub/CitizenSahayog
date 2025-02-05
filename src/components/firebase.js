// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD924tf3vY4Q_9k3gCbwkNLQ5b4jSgoEkU",
  authDomain: "citizen-sahayog.firebaseapp.com",
  projectId: "citizen-sahayog",
  storageBucket: "citizen-sahayog.appspot.com",
  messagingSenderId: "675026506627",
  appId: "1:675026506627:web:51a47e36df01bcc740dcb6",
  measurementId: "G-R8VSS9EBED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line
const analytics = getAnalytics(app);
export const storage=getStorage(app)