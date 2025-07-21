import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Set user data from Firebase Auth only
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          profilePicture: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime,
          emailVerified: firebaseUser.emailVerified,
          level: 1,
          xp: 0
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: fullName
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);
      // Try to create user document in Firestore, but don't fail if offline
      try {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: fullName,
          displayName: fullName,
          createdAt: new Date().toISOString(),
          level: 1,
          xp: 0,
          profilePicture: null
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);

        // Create initial data structure
        const initialData = {
          nutritionGoals: {
            dailyCalories: 2000,
            dailyProtein: 150,
            dailyCarbs: 250,
            dailyFat: 65,
            dailyWater: 64,
            waterUnit: 'oz'
          },
          preferences: {
            theme: 'light',
            notifications: true
          }
        };

        await setDoc(doc(db, 'userData', firebaseUser.uid), initialData);
      } catch (firestoreError) {
        console.warn('Could not create Firestore documents (offline):', firestoreError);
        // Continue with signup even if Firestore fails
      }

      return firebaseUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      throw error;
    }
  };
  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}