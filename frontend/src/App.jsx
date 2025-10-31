import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtenctedRoute.jsx';
import Chat from "./components/chat/Chat.jsx";
import LogInForm from './components/Form.jsx';
import SignUpForm from './components/SignUp.jsx';
import filter from 'leo-profanity'

const App = () => {
    filter.loadDictionary('ru');
    filter.add(filter.getDictionary('en'))
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LogInForm />} />
                <Route path='/signup' element={<SignUpForm />}></Route>
                <Route element={<ProtectedRoute />}>
                    <Route path='/' element={<Chat />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App