import i18next from "i18next"
import { I18nextProvider, initReactI18next} from "react-i18next"
import App from './App.jsx'
import resources from './locales/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import store from './slices/store.js'
import { Provider } from 'react-redux'
import { setupAxios } from './config/axios.js'
import { Provider as Prov, ErrorBoundary } from "@rollbar/react"

const init = async () => {
  const i18n = i18next.createInstance();
  setupAxios()
  
  await i18n
    .use(initReactI18next)
    .init({
      resources: resources.ru,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      }
    });

  const rollbarConfig = {
    accessToken: '522190b4993341f49b425ee92846d880',
    environment: 'testenv'
  }


  return (
    <Prov config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <App />
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </Prov>
  );
};

export default init;