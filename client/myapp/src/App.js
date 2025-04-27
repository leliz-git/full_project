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
import GalleryApartment from './componnents/Broker/GalleryApartment';
const LazyAuth = React.lazy(() => import('./componnents/Auth/Auth'))
const LazyFormDemo = React.lazy(() => import('./componnents/Auth/FormReg'))
const LazyFormLog = React.lazy(() => import('./componnents/Auth/FormLog'))
const LazyRecourse = React.lazy(() => import('./componnents/Recourses/Rec_AddApartment'))
const LazyB_Recourse = React.lazy(() => import('./componnents/Broker/B_Recourses'))
const LazyApartments = React.lazy(() => import('./componnents/Broker/GalleryApartment'))


function App() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)
  const items = [
    {
        label: 'Sign In',
        icon: 'pi pi-user',
        command: () => navigate('./signin')
    },
    {
        label: 'Register',
        icon: 'pi pi-user-plus',
        command: () => navigate('./register')
    },
    {
        label: 'Add Apartment',
        icon: 'pi pi-home',
        command: () => navigate('./add-apartment')
    }
];
 
  
  return(
    <div className="App">

    {/* <Rec_AddApartment></Rec_AddApartment> */}
      {/* <Auth></Auth> */}
      {/* <FormDemo></FormDemo> */}
      {/* <Alert></Alert> */}
      {/* <Router>   */}
      <Menubar model={items} />

<Suspense fallback={<div>Loading...</div>}>
    <Routes>
    {/* <Route path="/" element={<LazyAuth ></LazyAuth>} /> */}
    <Route path="/" element={<GalleryApartment ></GalleryApartment>} />
        <Route path="/signin" element={<LazyFormLog />} />
        <Route path="/register" element={<LazyFormDemo />} />
        <Route path="/add-apartment" element={<LazyRecourse />} />
        <Route path='/Apartments' element={<Suspense fallback="loading..."><LazyApartments /></Suspense>} />
    </Routes>
</Suspense>
{/* </Router> */}
      {/* <Route path='/' element={<Suspense fallback="loading..."><LazyAuth /></Suspense>} />
      <Route path='/Register' element={<Suspense fallback="loading..."><LazyFormDemo /></Suspense>} />
      <Route path='/Recourse' element={<Suspense fallback="loading..."><LazyRecourse /></Suspense>} />
      <Route path='/Personal' element={<Suspense fallback="loading..."><LazyB_Recourse /></Suspense>} /> */}
      {/* <Route path='/Apartments' element={<Suspense fallback="loading..."><LazyApartments /></Suspense>} /> */}
      
    
    </div>
  )


}
export default App;