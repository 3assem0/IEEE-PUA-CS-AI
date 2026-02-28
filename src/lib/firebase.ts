import { initializeApp, getApps, getApp } from "firebase/app";
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

// Diagnostic check (logs only, no throwing)
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && !["messagingSenderId", "appId"].includes(key))
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn("⚠️ Firebase Environment Variables are missing:", missingKeys);
}

let db: any = null;

try {
  // Check if every required key exists before initializing
  const hasRequiredKeys = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.databaseURL;
  
  if (hasRequiredKeys) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("✅ Firebase initialized successfully");
  } else {
    console.error("❌ Firebase could not be initialized: Required keys are missing.");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed unexpectedly:", error);
}

export { db };
