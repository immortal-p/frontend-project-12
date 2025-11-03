import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SignInForm from './components/SignIn.jsx';
import SignUpForm from './components/SignUp.jsx';
import filter from 'leo-profanity';
const Chat = lazy(() => import('./components/chat/Chat.jsx'));

const App = () => {
    filter.loadDictionary('ru');
    filter.add(filter.getDictionary('en'));
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/signin' element={<SignInForm />} />
                <Route path='/signup' element={<SignUpForm />} />
                <Route element={<ProtectedRoute />}>
                    <Route 
                        path='/' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Chat />
                            </Suspense>
                        } 
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;