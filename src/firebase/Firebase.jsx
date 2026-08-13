import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3Ut4R4mcbQEmfJJ6415rmy83AiWUV4oI",
  authDomain: "claimcare-a946a.firebaseapp.com",
  projectId: "claimcare-a946a",
  storageBucket: "claimcare-a946a.firebasestorage.app",
  messagingSenderId: "926524271492",
  appId: "1:926524271492:web:7a025595d65d5e4943cbd1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;