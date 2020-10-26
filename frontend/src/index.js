import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
import './stylesheets/App.css';
import 'antd/dist/antd.css';

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
