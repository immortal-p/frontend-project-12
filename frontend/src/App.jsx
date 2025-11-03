import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtenctedRoute.jsx'
import SignInForm from './components/SingIn.jsx'
import SignUpForm from './components/SignUp.jsx'
import filter from 'leo-profanity'
import Chat from './components/chat/Chat.jsx'

const App = () => {
  filter.loadDictionary('ru')
  filter.add(filter.getDictionary('en'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/signup' element={<SignUpForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
