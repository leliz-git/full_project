import React from 'react';
import axios from 'axios'
import { useRef, useState } from "react";
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FormReg from './FormReg';
import './Auth.css'
import FormLog from './FormLog';
import { Menubar } from 'primereact/menubar';
// import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import {useNavigate} from 'react-router-dom'
import Rec_AddApartment from '../Recourses/Rec_AddApartment'
import ApartmentGallery from '../Apartments/ApartmentGallery';


const Auth = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)

    const handleOpenLogin = () => {
        setVisible(true);
        setVisible1(false);
        setVisible2(false);
    };

    const handleOpenRegister = () => {
        setVisible1(true);
        setVisible(false);
        setVisible2(false);
    };

    const handleOpenRecourse = () => {
        setVisible1(false);
        setVisible(false);
        setVisible2(true);
    };
    
    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );
    const navigate = useNavigate();

    const items = [
        {
            label: 'Sign In',
            icon: 'pi pi-user',
            command: () => navigate('/signin')
        },
        {
            label: 'Register',
            icon: 'pi pi-user-plus',
            command: () => navigate('/register')
        },
        {
            label: 'Add Apartment',
            icon: 'pi pi-home',
            command: () => navigate('/add-apartment')
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );
    return (

        // <div className="card">
        //    <Menubar model={items} start={start} end={end}/>
        //    <div className="card">
        //     <Menubar model={items} />
           <div>
            {/* <Button label="Sign In" onClick={() => navigate('/signin')} severity="success"
                className="w-10rem_mx-auto" style={{ width: '10%', height: '4%' }} />

            <Button label="Register" onClick={() => navigate('/register')} severity="success"
                className="w-10rem" style={{ width: '6%', height: '4%' }} />

            <Button label="Apartment" onClick={() => navigate('/add-apartment')} severity="success"
                className="w-10rem" style={{ width: '20%', height: '4%' }} /> */}

           
       
                     {/* <Button label="Sign in"  onClick={() => {handleOpenLogin() }}  severity="success" className="w-10rem_mx-auto" style={{ width: '10%', height: '4%' }}/> */}
                     {/* <br></br>
                    // <br></br> */}
                     {/* <Button label="Register" onClick={() => { handleOpenRegister() } }  severity="success" className="w-10rem" style={{ width: '6%', height: '4%' }}  /> */}
                   
                     {/* <Button label="Apartment" onClick={() => { handleOpenRecourse() } }  severity="success" className="w-10rem" style={{ width: '20%', height: '4%' }}  /> */}
                         {/* <br></br> */}
                        {/* <br></br><br></br> */}
                    
                    <ApartmentGallery></ApartmentGallery>
                    
                  

                    {/* {visible && <FormLog setVisible={setVisible} visible={visible}/>} 
                     {visible1 && <FormReg setVisible1={setVisible1} visible1={visible1}/>} 
                   {visible2 && <Rec_AddApartment setVisible2={setVisible2} visible2={visible2}/>} */}
                </div>
       
    )
}

export default Auth;
