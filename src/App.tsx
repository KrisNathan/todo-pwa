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
import DeleteTask from './pages/dialogs/delete_task/DeleteTask'

import NewWorkspace from './pages/dialogs/new_workspace/NewWorkspace'
import DeleteWorkspace from './pages/dialogs/delete_workspace/DeleteWorkspace'
import RenameWorkspace from './pages/dialogs/rename_workspace/RenameWorkspace'
import SyncExit from './pages/dialogs/sync_exit/SyncExit'

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
          <Route path='/sync/exit' element={<SyncExit />} />

          <Route path='/task/new' element={<NewTask />} />
          <Route path='/task/edit/:taskId' element={<EditTask />} />
          <Route path='/task/delete/:taskId' element={<DeleteTask />} />

          <Route path='/workspace/new' element={<NewWorkspace />} />
          <Route path='/workspace/:workspaceId/delete' element={<DeleteWorkspace />} />
          <Route path='/workspace/:workspaceId/rename' element={<RenameWorkspace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
