import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useState, useEffect} from 'react'
import axios from "axios";


import './App.css'
import Index from './pages/Index/Index'
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  

  const fetchAPI = async () => {
    //const response = await axios.get("http://localhost:8000/login");

    //console.log(response.data.message);
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App;

