export function createPageUrl(pageName) {
  const pageMap = {
    'Home': '/',
    'Habits': '/habits',
    'HabitSelect': '/habit-select',
    'HabitDetail': '/habit-detail',
    'HabitForm': '/habit-form',
    'Progress': '/progress',
    'Features': '/features',
    'TodoList': '/todo-list',
    'Calendar': '/calendar',
    'Journal': '/journal',
    'FoodTracker': '/food-tracker',
    'Finance': '/finance',
    'School': '/school',
    'LifeStats': '/life-stats',
    'Goals': '/goals',
    'FutureSelf': '/future-self',
    'UnpackDay': '/unpack-day',
    'BucketList': '/bucket-list',
    'PasswordVault': '/password-vault'
  }
  
  return pageMap[pageName] || '/'
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString()
}