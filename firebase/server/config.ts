import Secrets from "./secrets.json";
import {
  ServiceAccount,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let auth: Auth;
let db: Firestore;

const currentApps = getApps();

if (currentApps.length <= 0) {
  const app = initializeApp({
    credential: cert(Secrets as ServiceAccount),
  });

  db = getFirestore(app);
  auth = getAuth(app);
} else {
  db = getFirestore(currentApps[0]);
  auth = getAuth(currentApps[0]);
}

export { auth, db };
