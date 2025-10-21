import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NoteRout from "./components/NoneRout.jsx";
import FormEl from './components/Form.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<NoteRout />}></Route>
                <Route path="/login" element={<FormEl />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App