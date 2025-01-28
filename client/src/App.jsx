import { useState, useEffect} from 'react'
import axios from "axios";


import './App.css'

function App() {
  

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8000");

    console.log(response.data.message);
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <h1>Hello</h1>
  )
}

export default App
