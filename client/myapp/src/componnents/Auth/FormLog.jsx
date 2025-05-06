import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form';
import  { useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './Form.css';
import Alert from './Alert'
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


        


const FormLog = (props) => {
    const accesstoken=useSelector((state)=>state.token.token)
    const [visible,setVisible]= useState(true);

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const[user,setUser]=useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const toastTopCenter = useRef(null);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;




    const showMessage1 = (event, ref, severity) => {
        const label = event.target.innerText;

        ref.current.show({ severity: severity, summary: label, detail: label, life: 3000 });
    };
    const [defaultValues, setDefaultValues] =useState( {
        username: '',
        password: ''
       
    })

    

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
   
    
    const onSubmit = async(data) => {
// debugger
        try {
            console.log(data);

            const res = await axios(
                {
                    method:'POST',
                    url:'http://localhost:7002/api/auth/login',
                    
                    data:{
                        username:data.username,
                        password:data.password
                    },
                    headers:{}
                    
                }
            )
            if (res.status === 200) {
                console.log(res.data);
                dispatch(setToken({token:res.data.accessToken}))
                console.log(res.data.accessToken);
                setFormData(data);
                setShowMessage(true);
                console.log(res);
                // setUser(res.data.user);  
                
                
                // navigate(`/Apartments/${userId}`)///////
                if(decoded.roles==="Broker")
                {
                    navigate(`/MyApartments`)
                }
                else if(decoded.roles==="Buyer" || decoded.roles==="Seller")
                {
                <Alert msg={"שלום"}></Alert>
                    navigate(`/Apartments`)
                    
                    // alert("Hi user")
                    setVisible(false)
                }
            }
            else{
                
            }
        } catch (e) {
            <Alert msg={"לא מורשה"}></Alert>
            // alert("לא מורשה")
            console.error(e)
            
        }
    

    
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" 
    autoFocus onClick={() => {setShowMessage(false);props.setVisible(false)}} /></div>;

useEffect(()=>{
    setVisible(true)
},[])

    return (
        
        
        <div className="form-demo">
           

            <Dialog header="כניסה" visible={visible} style={{  height: '20vw', width: '20vw', margin: '0', marginTop:'0', padding: '0'}} 
            onHide={() => {if (!visible) return; setVisible(false);navigate(`/`) }}>
            <div className="flex justify-content-center" 
           >
            
                <div className="card" style={{ padding: '0', margin: '0' }} >
              
                {/* {visible && <Dialog_login setVisible={setVisible} visible={visible}/>} */}
                    {/* <h5 className="text-center"  >Sign in</h5> */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ padding: '0', margin: '0' }}>
                      
                        <div className="field" >
                            <span className="p-float-label p-input-icon-right" style={{ padding: '0', margin: '0' }}>
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="username" control={control}
                                    rules={{ required: 'Username is required.'}}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                        // placeholder="username"   
                                        onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))}  />
                                )} />
                                <label htmlFor="username" className={classNames({ 'p-error': !!errors.email })}>שם משתמש*</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>
                      <br></br>
                        <div className="field" style={{ padding: '0', margin: '0' }}>
                            <span className="p-float-label" style={{ padding: '0', margin: '0' }}>
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })}   onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))}  />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>סיסמה*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        
                       
    
                         <br></br>
                         <br></br>
                         <Button type="button" label="איפוס" onClick={()=>(reset())} className="reset1" ></Button>
                         <Button type="submit" label="כניסה" className="mt-2"/>
                        

                        
                    </form>
                </div>
            </div>
            </Dialog>
            
        </div>
    );
}


export default FormLog;
   
