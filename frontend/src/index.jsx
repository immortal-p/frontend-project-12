import ReactDOM from 'react-dom/client'
import AppInit from './AppInit.jsx'

const app = () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'))
  root.render(<AppInit />)
}

app()
