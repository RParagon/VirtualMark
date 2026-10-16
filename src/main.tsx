import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { guardarHtmlEstatico } from './components/HtmlEstatico'
import './index.css'

const raiz = document.getElementById('root')!
if (raiz.children.length > 0) guardarHtmlEstatico(raiz)

ReactDOM.createRoot(raiz).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
