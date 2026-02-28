import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Diagnostic check
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && !["messagingSenderId", "appId"].includes(key))
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error("Missing Firebase Environment Variables:", missingKeys);
}

let db: any;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Re-throw to be caught by ErrorBoundary
  throw new Error("Could not initialize Firebase. Check your configuration.");
}

export { db };
