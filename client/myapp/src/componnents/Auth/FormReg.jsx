import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form';
import { useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './Form.css';
import { useNavigate } from 'react-router-dom';



const FormReg = (props) => {

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate()

    const [defaultValues, setDefaultValues] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        roles: '',
        accept: false
    })


    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    // const Register = async (props) => {


    // }
    const onSubmit = async (data) => {
        debugger
        try {

            const res = await axios(
                {
                    method: 'POST',
                    url: 'http://localhost:7002/api/auth/register',

                    data: {
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: data.password
                    }
                    // headers:{`Authorization: Berear ${}`}

                }
            )
            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                console.log(res);
                const userId=res.data.user._id//////
                const name=res.data.name/////
                navigate(`/register/${userId}/${name}`)/////
                // alert("Hi user")

            }
            else {

            }
        } catch (e) {
            console.error(e)
            alert("Registration failed")
        }

        // reset()

    };


    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" 
    autoFocus onClick={() => { setShowMessage(false); props.setVisible1(false) }} /></div>;



    return (


        <div className="form-demo">
            {/* <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} 
            showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration </h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your acount is registered under name
                        <b>{formData.name}</b> ;
                    </p>
                </div>
            </Dialog> */}

            <Dialog visible={props.visible1} style={{ width: '28vw', margin: '0', marginTop: '0', padding: '0' }} 
            onHide={() => { if (!props.visible1) return; props.setVisible1(false); }}>
                <div className="flex justify-content-center" style={{ padding: '0', margin: '0' }}>
                    <div className="card" style={{ padding: '0', margin: '0' }}>
                        {/* <h5 className="text-center">Register</h5> */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ padding: '0', margin: '0' }}>
                            <div className="field">
                                <span className="p-float-label" style={{ padding: '0', margin: '0' }}>
                                    <Controller name="name" control={control} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus 
                                        className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), 
                                                setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))}

                                        />

                                    )} />
                                    <label htmlFor="date">name</label>
                                </span>
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    {/* <i className="pi pi-envelope" /> */}
                                    <Controller name="username" control={control}
                                        rules={{ required: 'Username is required.' }}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                                // placeholder="name"   
                                                onChange={(e) => (field.onChange(e.target.value), 
                                                    setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))} />
                                        )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': !!errors.email })}>username*</label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    {/* <i className="pi pi-envelope" /> */}
                                    <Controller name="email" control={control}
                                        rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                                            message: 'Invalid email address. E.g. example@email.com' } }}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                                onChange={(e) => (field.onChange(e.target.value), 
                                                    setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))}
                                            />
                                        )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'Password is required.' }} 
                                    render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask 
                                        className={classNames({ 'p-invalid': fieldState.invalid })} 
                                        onChange={(e) => (field.onChange(e.target.value), 
                                        setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))} />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>

                            <div className="field-checkbox">
                                <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} 
                                    checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>
                            </div>


                            <br></br>
                            <br></br>
                            <Button type="button" label="reset" onClick={() => (reset())} className='reset1'></Button>
                            <Button type="submit" label="register" className="mt-2"
                            // onClick={(e) => {onSubmit(name,username,email,password)}}
                            />

                        </form>
                    </div>
                </div>
                <br></br>
                <br></br>
            </Dialog>
        </div>
    );
}


export default FormReg;

