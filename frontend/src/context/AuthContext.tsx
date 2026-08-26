import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db,
  signInWithGooglePopup, 
  FirebaseUser 
} from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  id: number;
  uid: string;
  username: string;
  email: string;
  full_name?: string;
  role: 'USER' | 'CREATOR' | 'TEACHER';
  photo_url?: string;
  created_at?: string;
  last_login_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'USER' | 'TEACHER') => Promise<void>;
  loginWithGoogle: (role?: 'USER' | 'TEACHER') => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isTeacher: boolean;
  isCreator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for deterministic integer ID from strings (e.g. Firebase UIDs)
const hashStringToInteger = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 1000 + Math.floor(Math.random() * 9000);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('codevault_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codevault_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile with Firestore users/{uid}
  const syncFirestoreProfile = async (fbUser: FirebaseUser, overrideRole?: 'USER' | 'TEACHER', overrideName?: string): Promise<UserProfile> => {
    const uid = fbUser.uid;
    const email = fbUser.email || '';
    const displayName = overrideName || fbUser.displayName || email.split('@')[0] || 'CodeVault User';
    const photoURL = fbUser.photoURL || '';
    const userDocRef = doc(db, 'users', uid);

    let role: 'USER' | 'CREATOR' | 'TEACHER' = overrideRole || 'USER';

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        role = data.role || role;
        await setDoc(userDocRef, {
          displayName,
          email,
          photoURL,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      } else {
        await setDoc(userDocRef, {
          uid,
          displayName,
          email,
          photoURL,
          role,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore profile sync note (fallback to local user):', err);
    }

    const appUser: UserProfile = {
      id: hashStringToInteger(uid),
      uid,
      username: email.split('@')[0] || uid.slice(0, 8),
      email,
      full_name: displayName,
      role,
      photo_url: photoURL,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    setUser(appUser);
    localStorage.setItem('codevault_user', JSON.stringify(appUser));
    return appUser;
  };

  // Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('codevault_token', idToken);
          await syncFirestoreProfile(fbUser);
        } catch (err) {
          console.error('Error getting user token / profile:', err);
        }
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('codevault_token');
        localStorage.removeItem('codevault_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Email / Password Sign In
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);
      await syncFirestoreProfile(cred.user);
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Standard Email / Password Registration
  const register = async (name: string, email: string, password: string, role: 'USER' | 'TEACHER' = 'USER') => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, {
        displayName: name.trim(),
      });
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);
      await syncFirestoreProfile(cred.user, role, name.trim());
    } catch (err: any) {
      console.error('Email registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In / Sign Up
  const loginWithGoogle = async (role: 'USER' | 'TEACHER' = 'USER'): Promise<UserProfile> => {
    setLoading(true);
    try {
      const fbUser = await signInWithGooglePopup();
      const idToken = await fbUser.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);
      const appUser = await syncFirestoreProfile(fbUser, role);
      return appUser;
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Password Reset Email
  const resetPassword = async (email: string) => {
    if (!email || !email.trim()) {
      throw new Error('Please provide a valid email address.');
    }
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('codevault_token');
      localStorage.removeItem('codevault_user');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const isTeacher = user?.role === 'TEACHER';
  const isCreator = user?.role === 'CREATOR' || isTeacher;

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        isTeacher,
        isCreator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
