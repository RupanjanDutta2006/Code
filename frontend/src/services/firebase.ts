import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// CodeVault Pro Firebase configuration (Loaded securely from environment variables)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_CODEVAULT_PLACEHOLDER_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codevaultpro.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "codevaultpro",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "codevaultpro.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:codevaultplaceholder",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

// Initialize Firebase Analytics safely for SSR / non-browser compatibility
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in this environment
  });
}

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

// GitHub Sign-In helper
export const signInWithGithubPopup = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    console.error('GitHub Sign-In Error:', error);
    throw error;
  }
};

// Phone reCAPTCHA helper
export const initPhoneRecaptcha = (containerId: string = 'recaptcha-container', invisible: boolean = true) => {
  // Clear any existing verifier on window if necessary
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Error clearing previous recaptchaVerifier:', e);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: invisible ? 'invisible' : 'normal',
    callback: () => {
      // reCAPTCHA solved - will allow signInWithPhoneNumber
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired. Please retry.');
    }
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

// Send Phone SMS OTP helper
export const sendPhoneOtpCode = async (
  phoneNumber: string, 
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error: any) {
    console.error('Send Phone OTP Error:', error);
    throw error;
  }
};

// Sign out helper
export const logOutFromFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
  }
};

export type { FirebaseUser, ConfirmationResult };
