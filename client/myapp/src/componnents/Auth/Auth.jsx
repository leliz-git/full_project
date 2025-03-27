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
import Rec_AddApartment from '../Recourses/Rec_AddApartment'


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
    

    return (

        <div className="card">
           
                    <Button label="Sign in"  onClick={() => {handleOpenLogin() }} icon="pi pi-user" severity="success" className="w-10rem_mx-auto" style={{ width: '6%', height: '4%' }}/>
                    {/* <br></br>
                    <br></br> */}
                    <Button label="Register" onClick={() => { handleOpenRegister() } } icon="pi pi-user-plus" severity="success" className="w-10rem" style={{ width: '6%', height: '4%' }}  />
                   
                    <Button label="Recourse" onClick={() => { handleOpenRecourse() } } icon="pi pi-user-plus" severity="success" className="w-10rem" style={{ width: '6%', height: '4%' }}  />
                   
                    {visible && <FormLog setVisible={setVisible} visible={visible}/>}
                    {visible1 && <FormReg setVisible1={setVisible1} visible1={visible1} />}
                    {visible2 && <Rec_AddApartment setVisible2={setVisible2} visible2={visible2}/>}
                </div>
       
    )
}

export default Auth;
