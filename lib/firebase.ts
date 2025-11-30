import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined") {
  // Only initialize on client side
  try {
    // Check if Firebase config is provided (not just empty strings)
    const hasConfig = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== "your_api_key_here" &&
                      firebaseConfig.projectId && 
                      firebaseConfig.projectId !== "your_project_id" &&
                      firebaseConfig.authDomain;
    
    if (hasConfig) {
      try {
        if (getApps().length === 0) {
          app = initializeApp(firebaseConfig);
          console.log("✅ Firebase initialized successfully");
        } else {
          app = getApps()[0];
          console.log("✅ Firebase already initialized");
        }
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("✅ Firebase Auth and Firestore ready");
        // Storage is optional - only initialize if config is provided
        try {
          storage = getStorage(app);
          console.log("✅ Firebase Storage ready");
        } catch (error) {
          // Storage not configured - that's okay, we don't need it
          console.log("ℹ️ Firebase Storage not configured (optional)");
        }
      } catch (initError) {
        console.error("❌ Firebase initialization error:", initError);
        // Don't crash - just use localStorage fallback
      }
    } else {
      console.log("ℹ️ Firebase config not found - using localStorage fallback");
      console.log("Config check:", {
        hasApiKey: !!firebaseConfig.apiKey,
        hasProjectId: !!firebaseConfig.projectId,
        hasAuthDomain: !!firebaseConfig.authDomain,
      });
    }
  } catch (error) {
    console.error("❌ Firebase setup error:", error);
    console.log("Falling back to localStorage");
  }
}

export { auth, db, storage };
export default app;

