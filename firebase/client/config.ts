// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// TODO: Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const currentApps = getApps();

let auth: Auth;
let db: Firestore;

// Ich prüfe zuerst ob es schon eine Instanz von der App gibt Also wenn keine Instanz vorhanden ist, initialisiere die Instanz der neuen App firebase
if (currentApps.length <= 0) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  auth = getAuth(currentApps[0]);
  db = getFirestore(currentApps[0]);
}

auth.languageCode = "de";

export { auth, db };
// const analytics = getAnalytics(app);
