import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {


  return (
    <>
  <Routes>
    <Route path='/' element={<Homepage/>}/>
    <Route path='/register' element={<RegisterPage/>}/>
    <Route path='/login' element={<LoginPage/>}/>
  </Routes>
    </>
  )
}

export default App
