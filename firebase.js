import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW05-nGWvVIvryMgVus2eCDig5hp8ZzMQ",
  authDomain: "movie-app-d135a.firebaseapp.com",
  projectId: "movie-app-d135a",
  storageBucket: "movie-app-d135a.appspot.com",
  messagingSenderId: "1020627167980",
  appId: "1:1020627167980:android:11a279a5cd27e1072f53c9"
};

 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);









