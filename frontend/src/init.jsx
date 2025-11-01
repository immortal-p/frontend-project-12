import React from "react";
import ReactDOM from "react-dom/client";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import App from "./App.jsx";
import resources from "./locales/index.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import store from "./slices/store.js";
import { Provider } from "react-redux";
import { setupAxios } from './config/axios.js';
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react";

setupAxios();


function TestError() {
  throw new Error("Тестовая ошибка Rollbar");
  return <div>Эта строка никогда не будет видна</div>;
}

export default TestError;

const i18n = i18next.createInstance();
i18n.use(initReactI18next).init({
  resources: resources.ru,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false }
}).then(() => {
  const rollbarConfig = {
    accessToken: '9f7e62d53f4347d2acb395ab1cc4afc4',
    environment: 'testenv',
  };

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <TestError />
            <App />
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
});
