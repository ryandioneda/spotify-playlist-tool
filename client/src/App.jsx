import { useState, useEffect} from 'react'
import axios from "axios";


import './App.css'

function App() {
  

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/users");

    console.log(response.data.users);
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <h1>Hello</h1>
  )
}

export default App
