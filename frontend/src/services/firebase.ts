import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// CodeVault Pro Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhcYHq5fhSybujFasFlH3LDnHlhJpBQJE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mediscan-ai-8f696.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mediscan-ai-8f696",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mediscan-ai-8f696.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "312494844658",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:312494844658:web:18cb50f6e94ac946c3fe6b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TZP6SX2VDB"
};

// Safe configuration validation without exposing private values
export const validateFirebaseConfig = (): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('PLACEHOLDER')) {
    missing.push('VITE_FIREBASE_API_KEY');
  }
  if (!firebaseConfig.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!firebaseConfig.appId || firebaseConfig.appId.includes('placeholder')) {
    missing.push('VITE_FIREBASE_APP_ID');
  }
  return { valid: missing.length === 0, missing };
};

const configValidation = validateFirebaseConfig();
if (!configValidation.valid) {
  console.warn(
    '[CodeVault Firebase] Incomplete configuration. Missing variables:',
    configValidation.missing.join(', ')
  );
}

// Initialize Firebase App singleton
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore Database
export const db: Firestore = getFirestore(app);

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firebase Analytics safely for SSR / browser environments
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Non-fatal analytics omission
  });
}

// Friendly error message mapper
export const mapAuthErrorToMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Sign-in popup was closed. Please try again when ready.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Sign-in popup was blocked by your browser. Please allow popups for CodeVault.';
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password. Please verify and try again.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code === 'auth/weak-password') {
    return 'Password is too short. Please choose a password with at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Access temporarily locked due to multiple failed attempts. Please try again in a few minutes or reset your password.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection problem. Please check your internet connection.';
  }
  if (code === 'auth/api-key-not-valid' || message.includes('api-key-not-valid') || message.includes('CONFIGURATION_NOT_FOUND')) {
    return 'Authentication service is initializing. Please verify that Firebase Authentication is enabled.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not yet authorized in Firebase Console > Authentication > Settings > Authorized domains.';
  }

  return 'Authentication failed. Please check your credentials and try again.';
};

// Google Sign-In helper
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Sign Out helper
export const logOutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

export type { FirebaseUser };
