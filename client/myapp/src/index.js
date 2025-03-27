import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import {store} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import {  persistor } from './redux/store'; // Make sure your store is configured correctl
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <BrowserRouter> <React.StrictMode>
     <Provider store={store} >
     <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider></React.StrictMode>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
