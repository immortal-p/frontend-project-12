import React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Provider } from 'react-redux'
import store from "./slices/store.js";
import { setupAxios } from './config/axios.js'
setupAxios()

const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(
    <Provider store={store}>
        <App />
    </Provider>
)