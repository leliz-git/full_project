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
import { useDispatch, useSelector } from 'react-redux';
// import { Link, Route, Routes } from 'react-router-dom'
import { Suspense, useState } from 'react';
import React from 'react';
import { Menubar } from 'primereact/menubar';
import Auth from './componnents/Auth/Auth';
import FormReg from './componnents/Auth/FormReg';
import Alert from './componnents/Auth/Alert'
import Rec_AddApartment from './componnents/Recourses/Rec_AddApartment';
import GalleryApartment from './componnents/Broker/GalleryApartment';
import { setToken, logOut } from './redux/tokenSlice';
import Chat from './componnents/Chat/chat'
import { jwtDecode } from 'jwt-decode';

const LazyAuth = React.lazy(() => import('./componnents/Auth/Auth'))
const LazyFormDemo = React.lazy(() => import('./componnents/Auth/FormReg'))
const LazyFormLog = React.lazy(() => import('./componnents/Auth/FormLog'))
const LazyRecourse = React.lazy(() => import('./componnents/Recourses/Rec_AddApartment'))
// const LazyB_Recourse = React.lazy(() => import('./componnents/Broker/B_Recourses'))
const LazyApartments = React.lazy(() => import('./componnents/Broker/GalleryApartment'))
const LazyApartmentsGalery = React.lazy(() => import('./componnents/Apartments/ApartmentGallery'))
const LazyApartmentsDetails = React.lazy(() => import('./componnents/Apartments/ApartmentDetails'))
const LazyUsers = React.lazy(() => import('./componnents/Users/AllUsers'))
const LazyPersonalArea = React.lazy(() => import('./componnents/Users/UserPersonalArea'))



function App() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const dispatch = useDispatch();

  const accesstoken=useSelector((state)=>state.token.token)
console.log(accesstoken)
let decoded = null;

if (accesstoken?.token && typeof accesstoken?.token === 'string') {
    try {
        decoded = jwtDecode(accesstoken?.token);
        console.log("Decoded token:", decoded);
    } catch (error) {
        console.error("Error decoding token:", error.message);
    }
} else {
    console.error("Invalid or missing token.");
}


  const handleLogout = () => {
    dispatch(logOut());  // הסרת הטוקן מה-Redux
    navigate('/');  // ניווט לעמוד ה-signin לאחר התנתקות
  };
  // console.log(decoded?.roles? decoded.roles :"no")
  // פריטי התפריט
  const items = [
    {
      label: accesstoken ? 'אזור אישי' : '',  // אם יש טוקן, "Logout", אחרת "Sign In"
      icon: accesstoken ? 'pi pi-user' : '',  // אם יש טוקן, "Logout" אייקון, אחרת "Sign In"
      command: accesstoken ? () => navigate('./User') :<></> // אם יש טוקן, יבוצע Logout אחרת ינווט ל-Sign In
    },
    {
      label: accesstoken ? 'יציאה' : 'כניסה',  // אם יש טוקן, "Logout", אחרת "Sign In"
      icon: accesstoken ? 'pi pi-sign-out' : 'pi pi-user',  // אם יש טוקן, "Logout" אייקון, אחרת "Sign In"
      command: accesstoken ? handleLogout : () => navigate('./signin')  // אם יש טוקן, יבוצע Logout אחרת ינווט ל-Sign In
    },
    {
      label: 'הרשמה',
      icon: 'pi pi-user-plus',
      command: accesstoken ? handleLogout : () => navigate('./register')
    },
    {
      label: decoded?.roles && decoded.roles==="Broker" ? 'דירות' : "",  // אם יש טוקן, "Logout", אחרת "Sign In"
      icon: decoded?.roles && decoded.roles==="Broker" ? 'pi pi-home' : "",  // אם יש טוקן, "Logout" אייקון, אחרת "Sign In"
      command: decoded?.roles && decoded.roles==="Broker" ? () => navigate('./MyApartments') : "" // אם יש טוקן, יבוצע Logout אחרת ינווט ל-Sign In
    },
    {
      label: decoded?.roles && decoded.roles==="Broker" ? 'משתמשים' : "",  // אם יש טוקן, "Logout", אחרת "Sign In"
      icon: decoded?.roles && decoded.roles==="Broker" ? 'pi pi-user' : "",  // אם יש טוקן, "Logout" אייקון, אחרת "Sign In"
      command: decoded?.roles && decoded.roles==="Broker" ? () => navigate('./Users') : "" // אם יש טוקן, יבוצע Logout אחרת ינווט ל-Sign In
    }
  ];
  const start = (
    <div className="flex align-items-center gap-2">
      {decoded && decoded.name ? <a><b>שלום  {decoded.name}</b></a> : <></>}
    </div>
  );

  return (
    <div className="App">

      <Menubar model={items} start={start} />
      {/* <Chat></Chat> */}

      <Suspense fallback={<div>Loading...</div>}>

        <Routes>
          <Route path="/" element={<LazyApartmentsGalery ></LazyApartmentsGalery>} />
          <Route path="/apartment/:_id" element={<LazyApartmentsDetails ></LazyApartmentsDetails>} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signin" element={<LazyFormLog />} />
          <Route path="/register" element={<LazyFormDemo />} />
          <Route path="/add-apartment" element={<LazyRecourse />} />
          <Route path='/MyApartments' element={ <LazyApartments />} />
          <Route path='/Apartments' element={ <LazyApartmentsGalery />} />
          <Route path='/Users' element={ <LazyUsers />} />
          <Route path='/User' element={ <LazyPersonalArea />} />

          
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