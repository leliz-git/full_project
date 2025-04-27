import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import './Rec_AddApartment.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

const Rec_UpdateApartment = (props) => {
    const [visible, setVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const toast = useRef(null);

    const neighborhoodsData = ['Ramot', 'Sanhedria', 'Har-Nof', 'Romema', 'Ramat Shlomo'];
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const { control, formState: { errors }, handleSubmit, reset } = useForm();
    useEffect(() => {
        setVisible(props.visible);
        setNeighborhoods(neighborhoodsData);
        if (props.apartment) {
            reset({
                ...props.apartment,
                neighborhood: props.apartment.neighborhood || '',
                number_of_rooms: props.apartment.number_of_rooms || '',
                floor: props.apartment.floor || '',
                price: props.apartment.price || '',
                yad2: props.apartment.yad2 || false,
                monopolism: props.apartment.monopolism || false,
                description: props.apartment.description || ''
            });
            setSelectedNeighborhood(props.apartment.neighborhood);
            setImagePreview(props.apartment.images);
        }
    }, [props.apartment, props.visible, reset]);

    // const { control, formState: { errors }, handleSubmit, reset } = useForm();
console.log(props.apartment)
    const onSubmit = async (data) => {
        try {
            const res = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/apartments/update`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    _id:props.apartment._id,
                    images: imagePreview,
                    monopolism: data.monopolism,
                    neighborhood: data.neighborhood,
                    number_of_rooms: data.number_of_rooms,
                    floor: data.floor,
                    price: data.price,
                    yad2: data.yad2,
                    description: data.description,
                    seller_id: decoded.seller_id
                }
            });
            if (res.status === 200) {
                props.setApartments(res.data);
                setShowMessage(true);
            }
        } catch (e) {
            console.error(e);
            alert("Update resource failed");
        }
    };

    const onSelect = (e) => {
        const file = e.files[0];
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
    };

    const getFormErrorMessage = (name) => errors[name] && <small className="p-error">{errors[name].message}</small>;

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => { setShowMessage(false); props.setVisible(false); }} />
        </div>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter}
                showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Apartment Updated</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your apartment has been updated successfully!
                    </p>
                </div>
            </Dialog>

            <Dialog visible={visible} onHide={() => props.onHide()} style={{ width: '28vw' }}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="price" control={control} render={({ field, fieldState }) => (
                                        <InputNumber min="1" step="1" id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} />
                                    )} />
                                    <label htmlFor="price">Price</label>
                                </span>
                                {getFormErrorMessage('price')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="number_of_rooms" control={control} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} type="number" />
                                    )} />
                                    <label htmlFor="number_of_rooms">Number of Rooms</label>
                                </span>
                                {getFormErrorMessage('number_of_rooms')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="floor" control={control} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} type="number" />
                                    )} />
                                    <label htmlFor="floor">Floor</label>
                                </span>
                                {getFormErrorMessage('floor')}
                            </div>

                            <div className="field">
                                <Controller name="neighborhood" control={control} render={({ field, fieldState }) => (
                                    <Dropdown value={field.value} options={neighborhoods} onChange={(e) => field.onChange(e.value)} placeholder="Select a neighborhood" />
                                )} />
                                {getFormErrorMessage('neighborhood')}
                            </div>

                            <div className="field-checkbox">
                                <Controller name="monopolism" control={control} render={({ field }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} />
                                )} />
                                <label htmlFor="monopolism">Monopolism</label>
                            </div>

                            <div className="field-checkbox">
                                <Controller name="yad2" control={control} render={({ field }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} />
                                )} />
                                <label htmlFor="yad2">Yad2</label>
                            </div>

                            <div>
                                <Toast ref={toast} />
                                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onSelect={onSelect} auto chooseLabel="Image" />
                                {imagePreview && (
                                    <div style={{ marginTop: '20px' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '200px', height: 'auto', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="description" control={control} render={({ field, fieldState }) => (
                                        <InputTextarea rows={8} cols={30} id={field.name} {...field} />
                                    )} />
                                    <label htmlFor="description">Description</label>
                                </span>
                                {getFormErrorMessage('description')}
                            </div>

                            <br />
                            <Button type="button" label="reset" onClick={() => (reset())} className='reset1'></Button>
                            <Button type="submit" label="Update" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Rec_UpdateApartment;

