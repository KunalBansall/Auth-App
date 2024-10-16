import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4P-2QuQ8kTuHSaaqk2wJR147bEJ-Ll9Q",
  authDomain: "auth-app-983c8.firebaseapp.com",
  projectId: "auth-app-983c8",
  storageBucket: "auth-app-983c8.appspot.com",
  messagingSenderId: "342572699945",
  appId: "1:342572699945:web:627646a15c42c25b846738",
  measurementId: "G-L4KX0MVC6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);


export { auth, provider,storage };

