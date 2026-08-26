import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logClientActivity } from '../services/activity';

export interface UserProfile {
  id: number;
  uid: string;
  username: string;
  email: string;
  full_name: string;
  displayName: string;
  phoneNumber?: string | null;
  phone_number?: string | null;
  profileRole?: 'student' | 'professor' | null;
  profile_role?: 'student' | 'professor' | null;
  role: 'USER' | 'CREATOR' | 'TEACHER' | 'ADMIN';
  photoURL?: string;
  photo_url?: string;
  profileCompleted: boolean;
  profile_completed: boolean;
  authProvider?: 'google' | 'password';
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

export type AuthState = 
  | 'AUTH_LOADING' 
  | 'PROFILE_LOADING' 
  | 'NEEDS_ONBOARDING' 
  | 'AUTHENTICATED' 
  | 'UNAUTHENTICATED';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string | null;
  profileRole?: 'student' | 'professor' | null;
}

export interface OnboardingData {
  displayName: string;
  phoneNumber?: string | null;
  profileRole?: 'student' | 'professor' | null;
}

export interface ProfileUpdateData {
  displayName?: string;
  phoneNumber?: string | null;
  profileRole?: 'student' | 'professor' | null;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  authState: AuthState;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<{ user: UserProfile; needsOnboarding: boolean }>;
  completeOnboarding: (data: OnboardingData) => Promise<UserProfile>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<UserProfile>;
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
    try {
      const saved = localStorage.getItem('codevault_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codevault_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>('AUTH_LOADING');
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  // Sync user profile from Firestore users/{uid}
  const loadOrCreateProfile = useCallback(async (
    fbUser: FirebaseUser,
    explicitData?: {
      displayName: string;
      phoneNumber?: string | null;
      profileRole?: 'student' | 'professor' | null;
      isNewRegistration?: boolean;
    }
  ): Promise<{ profile: UserProfile; requiresOnboarding: boolean }> => {
    const uid = fbUser.uid;
    const email = fbUser.email || '';
    const userDocRef = doc(db, 'users', uid);

    let finalName = explicitData?.displayName || fbUser.displayName || '';
    let phoneNumber = explicitData?.phoneNumber !== undefined ? explicitData.phoneNumber : null;
    let profileRole = explicitData?.profileRole !== undefined ? explicitData.profileRole : null;
    let role: 'USER' | 'CREATOR' | 'TEACHER' | 'ADMIN' = profileRole === 'professor' ? 'TEACHER' : 'USER';
    let profileCompleted = false;
    let photoURL = fbUser.photoURL || '';
    let authProvider: 'google' | 'password' = fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password';

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        finalName = explicitData?.displayName || data.displayName || data.full_name || fbUser.displayName || '';
        phoneNumber = explicitData?.phoneNumber !== undefined ? explicitData.phoneNumber : (data.phoneNumber || data.phone_number || null);
        profileRole = explicitData?.profileRole !== undefined ? explicitData.profileRole : (data.profileRole || data.profile_role || null);
        role = data.role || (profileRole === 'professor' ? 'TEACHER' : 'USER');
        photoURL = data.photoURL || data.photo_url || photoURL;
        authProvider = data.authProvider || authProvider;

        // Legacy compatibility: If user already has a non-empty name, mark as completed
        if (data.profileCompleted === true || (finalName && finalName.trim().length > 0)) {
          profileCompleted = true;
        }

        // Merge latest login metadata
        await setDoc(userDocRef, {
          email,
          displayName: finalName.trim(),
          photoURL,
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profileCompleted,
        }, { merge: true });
      } else {
        // First-time record creation
        if (explicitData?.isNewRegistration && finalName.trim()) {
          profileCompleted = true;
        } else if (finalName && finalName.trim().length > 0 && fbUser.providerData?.[0]?.providerId !== 'google.com') {
          profileCompleted = true;
        }

        await setDoc(userDocRef, {
          uid,
          displayName: finalName.trim(),
          email,
          photoURL,
          phoneNumber: phoneNumber || null,
          profileRole: profileRole || null,
          role,
          profileCompleted,
          authProvider,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore profile sync note (fallback to local state):', err);
      if (finalName && finalName.trim().length > 0) {
        profileCompleted = true;
      }
    }

    const appUser: UserProfile = {
      id: hashStringToInteger(uid),
      uid,
      username: email.split('@')[0] || uid.slice(0, 8),
      email,
      full_name: finalName.trim() || 'CodeVault User',
      displayName: finalName.trim() || 'CodeVault User',
      phoneNumber,
      phone_number: phoneNumber,
      profileRole,
      profile_role: profileRole,
      role,
      photoURL,
      photo_url: photoURL,
      profileCompleted,
      profile_completed: profileCompleted,
      authProvider,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    const requiresOnboarding = !profileCompleted || !finalName.trim();
    setUser(appUser);
    localStorage.setItem('codevault_user', JSON.stringify(appUser));
    setNeedsOnboarding(requiresOnboarding);
    setAuthState(requiresOnboarding ? 'NEEDS_ONBOARDING' : 'AUTHENTICATED');

    return { profile: appUser, requiresOnboarding };
  }, []);

  // Sync Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setAuthState('PROFILE_LOADING');
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('codevault_token', idToken);
          await loadOrCreateProfile(fbUser);
        } catch (err) {
          console.error('Error getting user token / profile:', err);
          setAuthState('UNAUTHENTICATED');
        }
      } else {
        setToken(null);
        setUser(null);
        setNeedsOnboarding(false);
        setAuthState('UNAUTHENTICATED');
        localStorage.removeItem('codevault_token');
        localStorage.removeItem('codevault_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadOrCreateProfile]);

  // Standard Email / Password Sign In (Existing User Flow)
  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);
      const { profile } = await loadOrCreateProfile(cred.user);
      logClientActivity({ action: 'auth.login_succeeded', category: 'auth' });
      return profile;
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Standard Email / Password Registration (New User Flow with Mandatory Name)
  const register = async (data: RegisterData): Promise<UserProfile> => {
    const trimmedName = (data.name || '').trim();
    if (!trimmedName) {
      throw new Error('Full Name is required to create an account.');
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      
      // Update Firebase Auth profile
      await updateProfile(cred.user, {
        displayName: trimmedName,
      });

      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);

      const { profile } = await loadOrCreateProfile(cred.user, {
        displayName: trimmedName,
        phoneNumber: data.phoneNumber?.trim() || null,
        profileRole: data.profileRole || null,
        isNewRegistration: true,
      });

      logClientActivity({ action: 'auth.signup_succeeded', category: 'auth' });
      return profile;
    } catch (err: any) {
      console.error('Email registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In / Sign Up
  const loginWithGoogle = async (): Promise<{ user: UserProfile; needsOnboarding: boolean }> => {
    setLoading(true);
    try {
      const fbUser = await signInWithGooglePopup();
      const idToken = await fbUser.getIdToken();
      setToken(idToken);
      localStorage.setItem('codevault_token', idToken);

      const { profile, requiresOnboarding } = await loadOrCreateProfile(fbUser);
      logClientActivity({ action: 'auth.login_succeeded', category: 'auth' });
      return { user: profile, needsOnboarding: requiresOnboarding };
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // First-time Onboarding Profile Completion
  const completeOnboarding = async (data: OnboardingData): Promise<UserProfile> => {
    const trimmedName = (data.displayName || '').trim();
    if (!trimmedName) {
      throw new Error('Full Name is required.');
    }

    if (!auth.currentUser) {
      throw new Error('No active authentication session found.');
    }

    const fbUser = auth.currentUser;
    const uid = fbUser.uid;
    const userDocRef = doc(db, 'users', uid);

    try {
      // 1. Update Firebase Auth displayName
      await updateProfile(fbUser, {
        displayName: trimmedName,
      });

      const profileRole = data.profileRole || null;
      const role: 'USER' | 'CREATOR' | 'TEACHER' | 'ADMIN' = profileRole === 'professor' ? 'TEACHER' : 'USER';
      const phoneNumber = data.phoneNumber?.trim() || null;

      // 2. Persist to Firestore
      await setDoc(userDocRef, {
        uid,
        displayName: trimmedName,
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        phoneNumber,
        profileRole,
        role,
        profileCompleted: true,
        authProvider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });

      const updatedUser: UserProfile = {
        id: hashStringToInteger(uid),
        uid,
        username: (fbUser.email || '').split('@')[0] || uid.slice(0, 8),
        email: fbUser.email || '',
        full_name: trimmedName,
        displayName: trimmedName,
        phoneNumber,
        phone_number: phoneNumber,
        profileRole,
        profile_role: profileRole,
        role,
        photoURL: fbUser.photoURL || '',
        photo_url: fbUser.photoURL || '',
        profileCompleted: true,
        profile_completed: true,
        authProvider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem('codevault_user', JSON.stringify(updatedUser));
      setNeedsOnboarding(false);
      setAuthState('AUTHENTICATED');

      logClientActivity({ action: 'auth.profile_completed', category: 'auth' });
      return updatedUser;
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      throw err;
    }
  };

  // Edit and Update Existing User Profile
  const updateUserProfile = async (data: ProfileUpdateData): Promise<UserProfile> => {
    if (!auth.currentUser || !user) {
      throw new Error('You must be logged in to update your profile.');
    }

    const fbUser = auth.currentUser;
    const uid = fbUser.uid;
    const userDocRef = doc(db, 'users', uid);

    const trimmedName = data.displayName !== undefined ? data.displayName.trim() : user.full_name;
    if (!trimmedName) {
      throw new Error('Full Name cannot be empty.');
    }

    try {
      if (data.displayName !== undefined && data.displayName.trim()) {
        await updateProfile(fbUser, {
          displayName: trimmedName,
        });
      }

      const updates: any = {
        displayName: trimmedName,
        updatedAt: serverTimestamp(),
      };

      if (data.phoneNumber !== undefined) {
        updates.phoneNumber = data.phoneNumber ? data.phoneNumber.trim() : null;
      }
      if (data.profileRole !== undefined) {
        updates.profileRole = data.profileRole || null;
      }

      await updateDoc(userDocRef, updates);

      const nextPhoneNumber = data.phoneNumber !== undefined ? (data.phoneNumber ? data.phoneNumber.trim() : null) : user.phoneNumber;
      const nextProfileRole = data.profileRole !== undefined ? data.profileRole : user.profileRole;

      const updatedUser: UserProfile = {
        ...user,
        full_name: trimmedName,
        displayName: trimmedName,
        phoneNumber: nextPhoneNumber,
        phone_number: nextPhoneNumber,
        profileRole: nextProfileRole,
        profile_role: nextProfileRole,
        updated_at: new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem('codevault_user', JSON.stringify(updatedUser));

      logClientActivity({ action: 'profile.updated', category: 'auth' });
      return updatedUser;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  // Password Reset Email
  const resetPassword = async (email: string) => {
    if (!email || !email.trim()) {
      throw new Error('Please provide a valid email address.');
    }
    await sendPasswordResetEmail(auth, email.trim());
    logClientActivity({ action: 'auth.password_reset_requested', category: 'auth' });
  };

  // Sign Out
  const logout = async () => {
    try {
      await logClientActivity({ action: 'auth.logout_requested', category: 'auth' });
    } catch {
      // Non-blocking
    }
    try {
      if (user?.uid) {
        try {
          const { clearUserMaterials } = await import('../services/studyMaterialsStorage');
          await clearUserMaterials(user.uid);
        } catch {
          // Non-blocking
        }
      }
      await signOut(auth);
      setToken(null);
      setUser(null);
      setFirebaseUser(null);
      setNeedsOnboarding(false);
      setAuthState('UNAUTHENTICATED');
      localStorage.removeItem('codevault_token');
      localStorage.removeItem('codevault_user');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const isTeacher = user?.role === 'TEACHER' || user?.profileRole === 'professor';
  const isCreator = user?.role === 'CREATOR' || isTeacher;

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        authState,
        needsOnboarding,
        login,
        register,
        loginWithGoogle,
        completeOnboarding,
        updateUserProfile,
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