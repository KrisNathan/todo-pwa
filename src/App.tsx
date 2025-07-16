import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import AllTasks from './pages/AllTasks'
import ImportantTasks from './pages/ImportantTasks'
import Layout from './layout/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<AllTasks />} />
          <Route path='/important' element={<ImportantTasks />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
