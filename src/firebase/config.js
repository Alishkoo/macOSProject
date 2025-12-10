import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQCV6xX_zH_VIqMWcr31j86r8kOIs8E3Q",
  authDomain: "react-endterm-3420d.firebaseapp.com",
  projectId: "react-endterm-3420d",
  storageBucket: "react-endterm-3420d.firebasestorage.app",
  messagingSenderId: "736371665176",
  appId: "1:736371665176:web:5071f07cde588f54f3966d",
  measurementId: "G-V6GXGF0DBC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
