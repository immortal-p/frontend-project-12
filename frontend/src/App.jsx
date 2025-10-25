import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtenctedRoute.jsx';
import Chat from "./components/chat/Chat.jsx";
import LogInForm from './components/Form.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LogInForm />} />
                <Route element={<ProtectedRoute />}>
                    <Route path='/' element={<Chat />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App