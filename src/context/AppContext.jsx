import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { format, addDays, subDays } from 'date-fns'

const AppContext = createContext()

// Mock user data
const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
  full_name: 'John Doe',
  profile_picture: null,
  level: 5,
  xp: 1250,
  created_date: '2024-01-01T00:00:00Z'
}

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
  user: mockUser,
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
    case 'LOAD_DATA':
      return { ...state, ...action.payload }
    
    case 'ADD_USER_HABIT':
      return {
        ...state,
        userHabits: [...state.userHabits, { ...action.payload, id: Date.now().toString() }]
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
        habitLogs: [...state.habitLogs, { ...action.payload, id: Date.now().toString() }]
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
        todos: [...state.todos, { ...action.payload, id: Date.now().toString(), created_date: new Date().toISOString() }]
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
        journalEntries: [...state.journalEntries, { ...action.payload, id: Date.now().toString(), created_by: state.user.email }]
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
        calendarEvents: [...state.calendarEvents, { ...action.payload, id: Date.now().toString() }]
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
        mealEntries: [...state.mealEntries, { ...action.payload, id: Date.now().toString() }]
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
        waterEntries: [...state.waterEntries, { ...action.payload, id: Date.now().toString() }]
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
        financeTransactions: [...state.financeTransactions, { ...action.payload, id: Date.now().toString() }]
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
        schoolAssignments: [...state.schoolAssignments, { ...action.payload, id: Date.now().toString() }]
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
        goals: [...state.goals, { ...action.payload, id: Date.now().toString() }]
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
        futureLetters: [...state.futureLetters, { ...action.payload, id: Date.now().toString() }]
      }
    
    case 'ADD_BUCKET_LIST_ITEM':
      return {
        ...state,
        bucketListItems: [...state.bucketListItems, { ...action.payload, id: Date.now().toString() }]
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
        dailyReflections: [...state.dailyReflections, { ...action.payload, id: Date.now().toString() }]
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('productivityAppData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: 'LOAD_DATA', payload: parsedData })
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('productivityAppData', JSON.stringify(state))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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