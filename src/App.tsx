import './App.css'
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import AllTasks from './pages/AllTasks'
import ImportantTasks from './pages/ImportantTasks'
import Layout from './layout/Layout'
import List from './pages/List'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Navigate to="/tasks/all" replace />} />
          <Route path='/tasks' element={<Navigate to="/tasks/all" replace />} />
          <Route path='/tasks/all' element={<AllTasks />} />
          <Route path='/tasks/important' element={<ImportantTasks />} />
          <Route path='/tasks/lists/:listName' element={<List />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
