import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '../context/AuthContext.tsx'
import { ChatProvider } from '../context/ChatContext.tsx'
import { AnonymousProvider } from '../context/AnonymousContext.tsx'

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
        <AuthProvider>
            <ChatProvider>
                <AnonymousProvider>
                    <App />
                </AnonymousProvider>
            </ChatProvider>
        </AuthProvider>
    </BrowserRouter>
)
