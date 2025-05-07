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
    const accesstoken = useSelector((state) => state.token.token);
    const [visible, setVisible] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toastTopCenter = useRef(null);
    const [defaultValues, setDefaultValues] = useState({
        username: '',
        password: ''
    });

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    // פונקציה לבדוק את תקינות הטוקן בזמן ייזום
    const checkToken = () => {
        if (accesstoken) {
            try {
                if (typeof accesstoken === 'string' && accesstoken.trim() !== '') {
                    console.log('Token is valid.');
                } else {
                    throw new Error('Invalid token: must be a non-empty string.');
                }
            } catch (error) {
                console.error('Error with token:', error.message);
                toastTopCenter.current.show({
                    severity: 'error',
                    summary: 'שגיאה',
                    detail: 'הטוקן אינו תקין. אנא התחבר מחדש.',
                    life: 3000,
                });
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log(data);

            const res = await axios({
                method: 'POST',
                url: 'http://localhost:7002/api/auth/login',
                data: {
                    username: data.username,
                    password: data.password,
                },
            });

            if (res.status === 200) {
                console.log("Login successful:", res.data);
                const token = res.data.accessToken;
                dispatch(setToken({ token: res.data.accessToken }));

                // פענוח הטוקן החדש
                const newDecoded = jwtDecode(token);
                console.log("New Decoded token:", newDecoded);

                if (newDecoded.roles === "Broker") {
                    navigate(`/MyApartments`);
                } else if (newDecoded.roles === "Buyer" || newDecoded.roles === "Seller") {
                    navigate(`/Apartments`);
                    setVisible(false);
                }
            } else {
                console.error("Unexpected status code:", res.status);
            }
        } catch (e) {
            console.error("Error during login:", e.message);
            alert("לא מורשה");
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <div className="form-demo">
            <Toast ref={toastTopCenter} /> {/* הצגת Toast */}
            <Dialog
                header="כניסה"
                visible={visible}
                style={{ height: '20vw', width: '20vw', margin: '0', marginTop: '0', padding: '0' }}
                onHide={() => { if (!visible) return; setVisible(false); navigate(`/`); }}
            >
                <div className="flex justify-content-center">
                    <div className="card" style={{ padding: '0', margin: '0' }}>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ padding: '0', margin: '0' }}>
                            <div className="field">
                                <span className="p-float-label p-input-icon-right" style={{ padding: '0', margin: '0' }}>
                                    <Controller
                                        name="username"
                                        control={control}
                                        rules={{ required: 'Username is required.' }}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                                onChange={(e) =>
                                                    (field.onChange(e.target.value),
                                                    setDefaultValues((prevValues) => ({
                                                        ...prevValues,
                                                        firstName: e.target.value,
                                                    })))
                                                }
                                            />
                                        )}
                                    />
                                    <label htmlFor="username" className={classNames({ 'p-error': !!errors.email })}>
                                        שם משתמש*
                                    </label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>
                            <br />
                            <div className="field" style={{ padding: '0', margin: '0' }}>
                                <span className="p-float-label" style={{ padding: '0', margin: '0' }}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: 'Password is required.' }}
                                        render={({ field, fieldState }) => (
                                            <Password
                                                id={field.name}
                                                {...field}
                                                toggleMask
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                                onChange={(e) =>
                                                    (field.onChange(e.target.value),
                                                    setDefaultValues((prevValues) => ({
                                                        ...prevValues,
                                                        firstName: e.target.value,
                                                    })))
                                                }
                                            />
                                        )}
                                    />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>
                                        סיסמה*
                                    </label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <br />
                            <br />
                            {/* <Button
                                type="button"
                                label="בדוק טוקן"
                                onClick={checkToken} // בדיקת הטוקן בלחיצה
                                className="p-button-warning"
                            /> */}
                            <Button
                                type="button"
                                label="איפוס"
                                onClick={() => reset()}
                                className="reset1"
                            />
                            <Button type="submit" label="כניסה" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default FormLog;