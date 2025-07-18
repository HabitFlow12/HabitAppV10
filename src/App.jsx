import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Habits from './pages/Habits'
import HabitSelect from './pages/HabitSelect'
import HabitDetail from './pages/HabitDetail'
import HabitForm from './pages/HabitForm'
import Progress from './pages/Progress'
import Features from './pages/Features'
import TodoList from './pages/TodoList'
import Calendar from './pages/Calendar'
import Journal from './pages/Journal'
import FoodTracker from './pages/FoodTracker'
import Finance from './pages/Finance'
import School from './pages/School'
import LifeStats from './pages/LifeStats'
import Goals from './pages/Goals'
import FutureSelf from './pages/FutureSelf'
import UnpackDay from './pages/UnpackDay'
import BucketList from './pages/BucketList'
import PasswordVault from './pages/PasswordVault'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/habit-select" element={<HabitSelect />} />
            <Route path="/habit-detail" element={<HabitDetail />} />
            <Route path="/habit-form" element={<HabitForm />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/features" element={<Features />} />
            <Route path="/todo-list" element={<TodoList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/food-tracker" element={<FoodTracker />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/school" element={<School />} />
            <Route path="/life-stats" element={<LifeStats />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/future-self" element={<FutureSelf />} />
            <Route path="/unpack-day" element={<UnpackDay />} />
            <Route path="/bucket-list" element={<BucketList />} />
            <Route path="/password-vault" element={<PasswordVault />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App