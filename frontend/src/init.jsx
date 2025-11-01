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
    accessToken: '522190b4993341f49b425ee92846d880c414b5734011c9de3a07330f006fa6e1e6970c50c023d78a00449d1de735a378',
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
