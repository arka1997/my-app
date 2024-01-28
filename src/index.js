import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Counter from './demo_code/Counter';
import { BrowserRouter } from 'react-router-dom';
import FileUploader from './demo_code/FileUploader';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    {/* <FileUploader /> */}
    {/* <Counter /> */}
    </BrowserRouter>
  </React.StrictMode>
);