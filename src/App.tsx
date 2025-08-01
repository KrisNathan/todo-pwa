import './App.css'
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import PageLayout from './layout/PageLayout'

import SyncSetupInitial from './pages/dialogs/sync_setup/SyncSetupInitial'
import SyncSetupJoinChain from './pages/dialogs/sync_setup/SyncSetupJoinChain'
import SyncSetupNewChain from './pages/dialogs/sync_setup/SyncSetupNewChain'

import NewTask from './pages/dialogs/new_task/NewTask'
import EditTask from './pages/dialogs/edit_task/EditTask'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
          <Route element={<PageLayout />} >
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/stats' element={<StatsPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>

          <Route path='/sync_setup' element={<SyncSetupInitial />} />
          <Route path='/sync_setup/join_chain' element={<SyncSetupJoinChain />} />
          <Route path='/sync_setup/new_chain' element={<SyncSetupNewChain />} />

          <Route path='/task/new' element={<NewTask />} />
          <Route path='/task/edit/:taskId' element={<EditTask />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
