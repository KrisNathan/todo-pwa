import './App.css'
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/stats' element={<StatsPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
