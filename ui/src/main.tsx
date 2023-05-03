import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import './index.css';

import Urbit from '@urbit/http-api';


export async function initializeApi(): Promise<Urbit> {
  const api = new Urbit('', '', window.desk);
  api.ship = window.ship;
  return api;
}

initializeApi().then(api => {
  window.urbit = api;
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
});
