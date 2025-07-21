import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { 
  userHabitsService, 
  habitLogsService, 
  todosService, 
  journalEntriesService,
  calendarEventsService,
  mealEntriesService,
  waterEntriesService,
  financeTransactionsService,
  schoolAssignmentsService,
  goalsService,
  futureLettersService,
  bucketListItemsService,
  dailyReflectionsService,
  userSettingsService
} from '../services/firestore'
import { format, addDays, subDays } from 'date-fns'

const AppContext = createContext()

// Mock habits data
const mockHabits = [
  {
    id: 'habit-1',
    title: 'Morning Meditation',
    description: 'Start your day with mindfulness and clarity',
    category: 'mindfulness',
    type: 'build',
    icon: '🧘',
    color: 'purple',
    techniques: [
      {
        name: 'Breath Awareness',
        description: 'Focus on your natural breathing pattern',
        scientific_backing: 'Studies show breath awareness reduces cortisol levels by 23%'
      }
    ],
    benefits: ['Reduced stress', 'Better focus', 'Improved emotional regulation'],
    questions: [
      { question: 'What time would you like to meditate?', type: 'time', required: true },
      { question: 'How many minutes?', type: 'number', required: true }
    ]
  },
  {
    id: 'habit-2',
    title: 'Daily Exercise',
    description: 'Keep your body active and healthy',
    category: 'fitness',
    type: 'build',
    icon: '💪',
    color: 'red',
    techniques: [
      {
        name: 'Progressive Overload',
        description: 'Gradually increase intensity over time',
        scientific_backing: 'Research shows progressive overload increases muscle strength by 40%'
      }
    ],
    benefits: ['Improved cardiovascular health', 'Increased energy', 'Better sleep'],
    questions: [
      { question: 'What type of exercise?', type: 'select', options: ['Cardio', 'Strength', 'Yoga', 'Mixed'], required: true },
      { question: 'How many minutes?', type: 'number', required: true }
    ]
  },
  {
    id: 'habit-3',
    title: 'Quit Social Media Scrolling',
    description: 'Break the habit of mindless scrolling',
    category: 'breaking',
    type: 'break',
    icon: '📱',
    color: 'gray',
    techniques: [
      {
        name: 'App Blocking',
        description: 'Use apps to block social media during certain hours',
        scientific_backing: 'Studies show app blocking reduces usage by 60%'
      }
    ],
    benefits: ['Better focus', 'Reduced anxiety', 'More time for meaningful activities'],
    questions: [
      { question: 'Which platforms do you want to limit?', type: 'text', required: true },
      { question: 'Set daily time limit (minutes)', type: 'number', required: true }
    ]
  }
]

// Initial state
const initialState = {
  user: null,
  habits: mockHabits,
  userHabits: [],
  habitLogs: [],
  todos: [],
  journalEntries: [],
  calendarEvents: [],
  mealEntries: [],
  waterEntries: [],
  nutritionGoals: {
    id: 'goals-1',
    user_id: 'user-1',
    daily_calories: 2000,
    daily_protein: 150,
    daily_carbs: 250,
    daily_fat: 65,
    daily_water: 64,
    water_unit: 'oz'
  },
  financeTransactions: [],
  budgets: [],
  schoolAssignments: [],
  goals: [],
  futureLetters: [],
  bucketListItems: [],
  dailyReflections: []
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload }
    
    case 'ADD_USER_HABIT':
      return {
        ...state,
        userHabits: [...state.userHabits, action.payload]
      }
    
    case 'UPDATE_USER_HABIT':
      return {
        ...state,
        userHabits: state.userHabits.map(habit =>
          habit.id === action.payload.id ? { ...habit, ...action.payload.updates } : habit
        )
      }
    
    case 'DELETE_USER_HABIT':
      return {
        ...state,
        userHabits: state.userHabits.filter(habit => habit.id !== action.payload)
      }
    
    case 'ADD_HABIT_LOG':
      return {
        ...state,
        habitLogs: [...state.habitLogs, action.payload]
      }
    
    case 'UPDATE_HABIT_LOG':
      return {
        ...state,
        habitLogs: state.habitLogs.map(log =>
          log.id === action.payload.id ? { ...log, ...action.payload.updates } : log
        )
      }
    
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload.updates } : todo
        )
      }
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    
    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.payload]
      }
    
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(entry =>
          entry.id === action.payload.id ? { ...entry, ...action.payload.updates } : entry
        )
      }
    
    case 'DELETE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.filter(entry => entry.id !== action.payload)
      }
    
    case 'ADD_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: [...state.calendarEvents, action.payload]
      }
    
    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.map(event =>
          event.id === action.payload.id ? { ...event, ...action.payload.updates } : event
        )
      }
    
    case 'DELETE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(event => event.id !== action.payload)
      }
    
    case 'ADD_MEAL_ENTRY':
      return {
        ...state,
        mealEntries: [...state.mealEntries, action.payload]
      }
    
    case 'UPDATE_MEAL_ENTRY':
      return {
        ...state,
        mealEntries: state.mealEntries.map(meal =>
          meal.id === action.payload.id ? { ...meal, ...action.payload.updates } : meal
        )
      }
    
    case 'DELETE_MEAL_ENTRY':
      return {
        ...state,
        mealEntries: state.mealEntries.filter(meal => meal.id !== action.payload)
      }
    
    case 'ADD_WATER_ENTRY':
      return {
        ...state,
        waterEntries: [...state.waterEntries, action.payload]
      }
    
    case 'DELETE_WATER_ENTRY':
      return {
        ...state,
        waterEntries: state.waterEntries.filter(entry => entry.id !== action.payload)
      }
    
    case 'UPDATE_NUTRITION_GOALS':
      return {
        ...state,
        nutritionGoals: { ...state.nutritionGoals, ...action.payload }
      }
    
    case 'ADD_FINANCE_TRANSACTION':
      return {
        ...state,
        financeTransactions: [...state.financeTransactions, action.payload]
      }
    
    case 'UPDATE_FINANCE_TRANSACTION':
      return {
        ...state,
        financeTransactions: state.financeTransactions.map(transaction =>
          transaction.id === action.payload.id ? { ...transaction, ...action.payload.updates } : transaction
        )
      }
    
    case 'DELETE_FINANCE_TRANSACTION':
      return {
        ...state,
        financeTransactions: state.financeTransactions.filter(transaction => transaction.id !== action.payload)
      }
    
    case 'ADD_SCHOOL_ASSIGNMENT':
      return {
        ...state,
        schoolAssignments: [...state.schoolAssignments, action.payload]
      }
    
    case 'UPDATE_SCHOOL_ASSIGNMENT':
      return {
        ...state,
        schoolAssignments: state.schoolAssignments.map(assignment =>
          assignment.id === action.payload.id ? { ...assignment, ...action.payload.updates } : assignment
        )
      }
    
    case 'DELETE_SCHOOL_ASSIGNMENT':
      return {
        ...state,
        schoolAssignments: state.schoolAssignments.filter(assignment => assignment.id !== action.payload)
      }
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      }
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? { ...goal, ...action.payload.updates } : goal
        )
      }
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      }
    
    case 'ADD_FUTURE_LETTER':
      return {
        ...state,
        futureLetters: [...state.futureLetters, action.payload]
      }
    
    case 'ADD_BUCKET_LIST_ITEM':
      return {
        ...state,
        bucketListItems: [...state.bucketListItems, action.payload]
      }
    
    case 'UPDATE_BUCKET_LIST_ITEM':
      return {
        ...state,
        bucketListItems: state.bucketListItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      }
    
    case 'DELETE_BUCKET_LIST_ITEM':
      return {
        ...state,
        bucketListItems: state.bucketListItems.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_DAILY_REFLECTION':
      return {
        ...state,
        dailyReflections: [...state.dailyReflections, action.payload]
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_USER', payload: user })
      loadUserData()
    } else {
      // Reset state when user logs out
      dispatch({ type: 'LOAD_DATA', payload: initialState })
    }
  }, [user])

  const loadUserData = async () => {
    if (!user?.uid) return

    try {
      const [
        userHabits,
        habitLogs,
        todos,
        journalEntries,
        calendarEvents,
        mealEntries,
        waterEntries,
        financeTransactions,
        schoolAssignments,
        goals,
        futureLetters,
        bucketListItems,
        dailyReflections,
        userSettings
      ] = await Promise.all([
        userHabitsService.getAll(user.uid).catch(() => []),
        habitLogsService.getAll(user.uid).catch(() => []),
        todosService.getAll(user.uid).catch(() => []),
        journalEntriesService.getAll(user.uid).catch(() => []),
        calendarEventsService.getAll(user.uid).catch(() => []),
        mealEntriesService.getAll(user.uid).catch(() => []),
        waterEntriesService.getAll(user.uid).catch(() => []),
        financeTransactionsService.getAll(user.uid).catch(() => []),
        schoolAssignmentsService.getAll(user.uid).catch(() => []),
        goalsService.getAll(user.uid).catch(() => []),
        futureLettersService.getAll(user.uid).catch(() => []),
        bucketListItemsService.getAll(user.uid).catch(() => []),
        dailyReflectionsService.getAll(user.uid).catch(() => []),
        userSettingsService.get(user.uid).catch(() => ({ nutritionGoals: state.nutritionGoals }))
      ])

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          ...state,
          userHabits,
          habitLogs,
          todos,
          journalEntries,
          calendarEvents,
          mealEntries,
          waterEntries,
          financeTransactions,
          schoolAssignments,
          goals,
          futureLetters,
          bucketListItems,
          dailyReflections,
          nutritionGoals: userSettings.nutritionGoals || state.nutritionGoals
        }
      })
    } catch (error) {
      console.warn('Could not load user data (offline mode):', error)
      // Continue with default state if offline
    }
  }

  // Enhanced dispatch that syncs with Firestore
  const enhancedDispatch = async (action) => {
    if (!user?.uid) {
      dispatch(action)
      return
    }

    try {
      let result
      
      switch (action.type) {
        case 'ADD_USER_HABIT':
          result = await userHabitsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_USER_HABIT':
          await userHabitsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_USER_HABIT':
          await userHabitsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_HABIT_LOG':
          result = await habitLogsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_HABIT_LOG':
          await habitLogsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'ADD_TODO':
          result = await todosService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_TODO':
          await todosService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_TODO':
          await todosService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_JOURNAL_ENTRY':
          result = await journalEntriesService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_JOURNAL_ENTRY':
          await journalEntriesService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_JOURNAL_ENTRY':
          await journalEntriesService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_CALENDAR_EVENT':
          result = await calendarEventsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_CALENDAR_EVENT':
          await calendarEventsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_CALENDAR_EVENT':
          await calendarEventsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_MEAL_ENTRY':
          result = await mealEntriesService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_MEAL_ENTRY':
          await mealEntriesService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_MEAL_ENTRY':
          await mealEntriesService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_WATER_ENTRY':
          result = await waterEntriesService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'DELETE_WATER_ENTRY':
          await waterEntriesService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'UPDATE_NUTRITION_GOALS':
          const currentSettings = await userSettingsService.get(user.uid)
          await userSettingsService.update(user.uid, {
            ...currentSettings,
            nutritionGoals: { ...currentSettings.nutritionGoals, ...action.payload }
          })
          dispatch(action)
          break
          
        case 'ADD_FINANCE_TRANSACTION':
          result = await financeTransactionsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_FINANCE_TRANSACTION':
          await financeTransactionsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_FINANCE_TRANSACTION':
          await financeTransactionsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_SCHOOL_ASSIGNMENT':
          result = await schoolAssignmentsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_SCHOOL_ASSIGNMENT':
          await schoolAssignmentsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_SCHOOL_ASSIGNMENT':
          await schoolAssignmentsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_GOAL':
          result = await goalsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_GOAL':
          await goalsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_GOAL':
          await goalsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_FUTURE_LETTER':
          result = await futureLettersService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'ADD_BUCKET_LIST_ITEM':
          result = await bucketListItemsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        case 'UPDATE_BUCKET_LIST_ITEM':
          await bucketListItemsService.update(user.uid, action.payload.id, action.payload.updates)
          dispatch(action)
          break
          
        case 'DELETE_BUCKET_LIST_ITEM':
          await bucketListItemsService.delete(user.uid, action.payload)
          dispatch(action)
          break
          
        case 'ADD_DAILY_REFLECTION':
          result = await dailyReflectionsService.create(action.payload, user.uid)
          dispatch({ type: action.type, payload: result })
          break
          
        default:
          dispatch(action)
      }
    } catch (error) {
      console.error('Error syncing with Firestore:', error)
      // Still dispatch locally to maintain UI responsiveness
      dispatch(action)
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}