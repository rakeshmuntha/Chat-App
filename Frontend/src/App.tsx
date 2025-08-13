import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'


function App() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { authUser, currState } = context;

    const wakeBackend = async () => {
        const data = await axios.get("/");
        console.log(data.data);
    }

    useEffect(() => {
        wakeBackend();
    }, [])
    

    return (
        <div className='bg-[url("/bgImage.svg")] bg-contain'>
            <Toaster />
            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'}/>} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={currState === 'signup' ? '/profile' : '/'}/>} />
                <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'}/>} />
            </Routes>
        </div>
    )
}

export default App
