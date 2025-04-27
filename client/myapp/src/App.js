import logo from './logo.svg';
import './App.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import './index.css';
import './flags.css';



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { Link, Route, Routes } from 'react-router-dom'
import { Suspense, useState } from 'react';
import React from 'react';
import { Menubar } from 'primereact/menubar';
import Auth from './componnents/Auth/Auth';
import FormReg from './componnents/Auth/FormReg';
import Alert from './componnents/Auth/Alert'
import Rec_AddApartment from './componnents/Recourses/Rec_AddApartment';
const LazyAuth = React.lazy(() => import('./componnents/Auth/Auth'))
const LazyFormDemo = React.lazy(() => import('./componnents/Auth/FormReg'))
const LazyFormLog = React.lazy(() => import('./componnents/Auth/FormLog'))
const LazyRecourse = React.lazy(() => import('./componnents/Recourses/Rec_AddApartment'))
const LazyB_Recourse = React.lazy(() => import('./componnents/Broker/B_Recourses'))
const LazyApartments = React.lazy(() => import('./componnents/Apartments/ApartmentGallery'))

function App() {
 
 
  
  return(
    <div className="App">

    {/* <Rec_AddApartment></Rec_AddApartment> */}
      {/* <Auth></Auth> */}
      {/* <FormDemo></FormDemo> */}
      {/* <Alert></Alert> */}
      {/* <Router>  <Router> נמצא רק כאן, ב-App */}


<Suspense fallback={<div>Loading...</div>}>
    <Routes>
        
        <Route path="/signin" element={<LazyFormLog />} />
        <Route path="/register" element={<LazyFormDemo />} />
        <Route path="/add-apartment" element={<LazyRecourse />} />
    </Routes>
</Suspense>
{/* </Router> */}
      {/* <Route path='/' element={<Suspense fallback="loading..."><LazyAuth /></Suspense>} />
      <Route path='/Register' element={<Suspense fallback="loading..."><LazyFormDemo /></Suspense>} />
      <Route path='/Recourse' element={<Suspense fallback="loading..."><LazyRecourse /></Suspense>} />
      <Route path='/Personal' element={<Suspense fallback="loading..."><LazyB_Recourse /></Suspense>} />
      <Route path='/Apartments' element={<Suspense fallback="loading..."><LazyApartments /></Suspense>} /> */}
      
    
    </div>
  )


}
export default App;