import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav/Nav';

import Index from './pages/Index/Index'
import Dashboard from './pages/Dashboard/Dashboard';

import './index.css'

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App;

