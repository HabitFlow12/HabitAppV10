import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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
  const [firebaseAuthError, setFirebaseAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseAuthError(null);
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFirebaseAuthError(error);
          // Set basic user data from Firebase Auth even if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            fullName: firebaseUser.displayName
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: fullName
      });

      // Create user document in Firestore
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

      // Initialize user's collections with empty arrays/objects
      const collections = [
        'habits',
        'userHabits', 
        'habitLogs',
        'todos',
        'journalEntries',
        'calendarEvents',
        'mealEntries',
        'waterEntries',
        'financeTransactions',
        'budgets',
        'schoolAssignments',
        'goals',
        'futureLetters',
        'bucketListItems',
        'dailyReflections'
      ];

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

      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
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

  const value = {
    user,
    loading,
    firebaseAuthError,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}