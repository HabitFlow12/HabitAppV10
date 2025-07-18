import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Generic Firestore service class
export class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(data, userId) {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, this.collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get all documents for a user
  async getAll(userId, orderByField = 'createdAt', orderDirection = 'desc') {
    try {
      const q = query(
        collection(db, 'users', userId, this.collectionName),
        orderBy(orderByField, orderDirection)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get documents with filter
  async getFiltered(userId, filters = {}, orderByField = 'createdAt', orderDirection = 'desc') {
    try {
      let q = collection(db, 'users', userId, this.collectionName);
      
      // Apply filters
      Object.entries(filters).forEach(([field, value]) => {
        q = query(q, where(field, '==', value));
      });
      
      // Apply ordering
      q = query(q, orderBy(orderByField, orderDirection));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error filtering ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document
  async getById(userId, docId) {
    try {
      const docRef = doc(db, 'users', userId, this.collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Update a document
  async update(userId, docId, data) {
    try {
      const docRef = doc(db, 'users', userId, this.collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id: docId, ...data };
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(userId, docId) {
    try {
      const docRef = doc(db, 'users', userId, this.collectionName, docId);
      await deleteDoc(docRef);
      return docId;
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  subscribe(userId, callback, orderByField = 'createdAt', orderDirection = 'desc') {
    const q = query(
      collection(db, 'users', userId, this.collectionName),
      orderBy(orderByField, orderDirection)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
  }
}

// User settings service (stored directly in user document)
export class UserSettingsService {
  async get(userId) {
    try {
      const docRef = doc(db, 'userData', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Return default settings if none exist
        const defaultSettings = {
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
        await this.update(userId, defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  }

  async update(userId, data) {
    try {
      const docRef = doc(db, 'userData', userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }
}

// Create service instances for each collection
export const habitsService = new FirestoreService('habits');
export const userHabitsService = new FirestoreService('userHabits');
export const habitLogsService = new FirestoreService('habitLogs');
export const todosService = new FirestoreService('todos');
export const journalEntriesService = new FirestoreService('journalEntries');
export const calendarEventsService = new FirestoreService('calendarEvents');
export const mealEntriesService = new FirestoreService('mealEntries');
export const waterEntriesService = new FirestoreService('waterEntries');
export const financeTransactionsService = new FirestoreService('financeTransactions');
export const budgetsService = new FirestoreService('budgets');
export const schoolAssignmentsService = new FirestoreService('schoolAssignments');
export const goalsService = new FirestoreService('goals');
export const futureLettersService = new FirestoreService('futureLetters');
export const bucketListItemsService = new FirestoreService('bucketListItems');
export const dailyReflectionsService = new FirestoreService('dailyReflections');
export const userSettingsService = new UserSettingsService();