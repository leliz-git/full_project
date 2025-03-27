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
import TextareaAutosize from 'react-textarea-autosize';
import { MultiSelect } from 'primereact/multiselect';
import { Mention } from 'primereact/mention';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from 'react-redux'; // ייבוא useSelector
import { jwtDecode } from 'jwt-decode';




const Rec_AddApartment = (props) => {

    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const neighborhoodsData = [
        'Ramot' ,
         'Sanhedria',
        'Har-Nof',
        'Romema' ,
        'Ramat Shlomo' 
    ]

    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);


    const [data, setData] = useState([]);
    const [error, setError] = useState(null);




    useEffect(() => {
        // עדכון ה-state עם המערך
        setNeighborhoods(neighborhoodsData);
    }, []); // [] כדי שהאנימציה תתרחש בפעם הראשונה בלבד

    useEffect(() => {
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('https://data.gov.il/api/action/datastore_search', {
    //                 params: {
    //                     resource_id: 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37',
    //                     limit: 1500
    //                 }
    //             });
    //             if (response.data.result && response.data.result.records) {
    //                 setData(response.data.result.records);
    //             } else {
    //                 setError('No records found');
    //             }
    //         } catch (error) {
    //             setError('There was an error making the request');
    //             console.error(error);
    //         }
    //     };

    //     fetchData();
    // }, []); // ריק [] משמעותו להריץ את הפונקציה בפעם אחת בעת ההתקנה

    // const neighborhoods= data.result.records.map(item => console.log(item));
    console.log(data.values)

    const [defaultValues, setDefaultValues] = useState({
        images: "",
        monopolism: false,
        neighborhood: '',
        number_of_rooms: '',
        floor: '',
        price: '',
        yad2: false,
        description: ''
    })


    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
debugger
        try {

            console.log(data);
            console.log(accesstoken)
            const res = await axios(
                {
                    method: 'POST',
                    url: 'http://localhost:7002/api/apartments/add',
                    headers:{ Authorization: "Bearer " + accesstoken},
                    data: {
                        images: defaultValues.images,
                        monopolism: data.monopolism,
                        neighborhood: data.neighborhood,
                        number_of_rooms: data.number_of_rooms,
                        floor: data.floor,
                        price: data.price,
                        yad2: data.yad2,
                        description: data.description,
                        seller_id: decoded.seller_id
                        },        
                } 
            )
        
            if (res.status === 201) {
                alert("Hi user")
                setFormData(data);
                setShowMessage(true);
                console.log(res);
            }

            else {

            }
        } catch (e) {
            console.error(e)
            alert("Add recourse failed")
        }
    };


    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text"
        autoFocus onClick={() => { setShowMessage(false); props.setVisible(false) }} /></div>;



    return (



        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter}
                showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Add apartment </h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your apartment added, good lock!
                        <b>{formData.name}</b> ;
                    </p>
                </div>
            </Dialog>



            <Dialog visible={props.visible2} style={{ width: '28vw' }}
                onHide={() => { if (!props.visible2) return; props.setVisible2(false); }}>

                <div className="flex justify-content-center">
                    <div className="card">
                        {/* <h5 className="text-center">Register</h5> */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="price" control={control} render={({ field, fieldState }) => (
                                        <InputNumber id={field.name} inputId="integeronly" autoFocus
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))} />
                                    )} />
                                    <label htmlFor="price">price</label>
                                </span>
                                {getFormErrorMessage('description')}
                            </div>


                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="number_of_rooms" control={control} render={({ field, fieldState }) => (
                                        <InputText type="number" id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, number_of_rooms: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="date">number_of_rooms</label>
                                </span>
                                {getFormErrorMessage('number_of_rooms')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="floor" control={control} render={({ field, fieldState }) => (
                                        <InputText type="number" id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, number_of_rooms: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="date">floor</label>
                                </span>
                                {getFormErrorMessage('floor')}
                            </div>



                            <div className="card flex justify-content-center">
                                <Controller
                                    name="neighborhood"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Dropdown
                                            value={selectedNeighborhood}
                                            onChange={(e) => {
                                                setSelectedNeighborhood(e.value); // עדכון state
                                                field.onChange(e.value); // עדכון react-hook-form
                                            }}
                                            options={neighborhoods}
                                            // optionLabel="name"
                                            showClear
                                            placeholder="Select a neighborhood"
                                            id={field.name}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                {getFormErrorMessage('neighborhood')}
                            </div>

                            <div className="field-checkbox">
                                <Controller name="monopolism" control={control} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)}
                                        checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="monopolism" className={classNames({ 'p-error': errors.accept })}>monopolism</label>
                            </div>


                            <div className="field-checkbox">
                                <Controller name="yad2" control={control} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)}
                                        checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="yad2" className={classNames({ 'p-error': errors.accept })}>yad2</label>
                            </div>


                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="description" control={control} render={({ field, fieldState }) => (
                                        <InputTextarea rows={8} cols={30} id={field.name} {...field} autoFocus 
                                        className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, number_of_rooms: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="date">description</label>
                                </span>
                                {getFormErrorMessage('description')}
                            </div>


                            <br></br>
                            <br></br>
                            <Button type="button" label="reset" onClick={() => (reset())} className='reset1'></Button>
                            <Button type="submit" label="send" className="mt-2"

                            />

                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}


export default Rec_AddApartment;


