import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuCO_FPClqq7TgfP6w_CFcWcduaSU0VV0",
  authDomain: "whatsapp-clone-ed8f8.firebaseapp.com",
  projectId: "whatsapp-clone-ed8f8",
  storageBucket: "whatsapp-clone-ed8f8.appspot.com",
  messagingSenderId: "119711637794",
  appId: "1:119711637794:web:727b0b1c094dc4adf3857b",
  measurementId: "G-SS7NBN2R6L",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
