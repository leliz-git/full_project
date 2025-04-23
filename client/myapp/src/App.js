import logo from './logo.svg';
import './App.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import './index.css';
import './flags.css';

import { useNavigate } from 'react-router-dom';
import { Link, Route, Routes } from 'react-router-dom'
import { Suspense, useState } from 'react';
import React from 'react';
import { Menubar } from 'primereact/menubar';
import Auth from './componnents/Auth/Auth';
import FormReg from './componnents/Auth/FormReg';
import Alert from './componnents/Auth/Alert'
import Rec_AddApartment from './componnents/Recourses/Rec_AddApartment';
const LazyAuth = React.lazy(() => import('./componnents/Auth/Auth'))
const LazyFormDemo = React.lazy(() => import('./componnents/Auth/FormReg'))
const LazyRecourse = React.lazy(() => import('./componnents/Recourses/Rec_AddApartment'))
const LazyB_Recourse = React.lazy(() => import('./componnents/Broker/B_Recourses'))

function App() {
 
 
  
  return(
    <div className="App">

    {/* <Rec_AddApartment></Rec_AddApartment> */}
      {/* <Auth></Auth> */}
      {/* <FormDemo></FormDemo> */}
      {/* <Alert></Alert> */}
      <Routes>
      <Route path='/' element={<Suspense fallback="loading..."><LazyAuth /></Suspense>} />
      <Route path='/Register' element={<Suspense fallback="loading..."><LazyFormDemo /></Suspense>} />
      <Route path='/Recourse' element={<Suspense fallback="loading..."><LazyRecourse /></Suspense>} />
      <Route path='/Personal' element={<Suspense fallback="loading..."><LazyB_Recourse /></Suspense>} />
      
    </Routes>
    </div>
  )


}
export default App;