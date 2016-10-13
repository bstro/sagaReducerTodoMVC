import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import Store from './Store'

import '../node_modules/todomvc-app-css/index.css'
import '../node_modules/todomvc-common/base.css'
import './index.css'

render(
  <Provider store={Store}>
    <div>
      <App />
      <footer className="info">
        <p>Written by <a href="https://github.com/bstro">Brendan Stromberger</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </div>
  </Provider>,
  document.getElementById('root')
)