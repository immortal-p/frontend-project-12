import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import App from './App.jsx'
import resources from './locales/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import { Provider } from 'react-redux'
import store from './slices/store.js'
import setupAxios from './config/axios.js'
import { createSocketManager } from './socketInit.js'
import { Provider as Prov, ErrorBoundary } from '@rollbar/react'
import rollbarConfig from './config/rollbar.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppInit = () => {
  const [i18n, setI18n] = useState(null)
  const { initSocket } = createSocketManager()
  const savedLng = localStorage.getItem('lng') || 'ru'
  useEffect(() => {
    const initApp = async () => {
      await i18next.use(initReactI18next).init({
        resources: {
          ru: resources.ru,
          en: resources.en,
        },
        lng: savedLng,
        fallbackLng: 'ru',
        interpolation: { escapeValue: false },
      })
      setI18n(i18next)

      setupAxios()
      initSocket(i18next.t)
    }
    initApp()
  }, [])

  if (!i18n) return null

  return (
    <Prov config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <App />
            <ToastContainer draggable />
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </Prov>
  )
}

export default AppInit
