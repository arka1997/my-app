import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Counter from './demo_code/Counter';
import Xyz from './demo_code/Xyz';
import CallbackHell from './demo_code/CallbackHell';
import Promises from './demo_code/Promises';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    {/* <Counter /> */}
    {/* <Xyz /> */}
    {/* <CallbackHell /> */}
    {/* <Promises/> */}
    </BrowserRouter>
  </React.StrictMode>
);