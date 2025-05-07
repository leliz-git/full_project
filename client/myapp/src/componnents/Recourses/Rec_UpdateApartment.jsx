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
import { FileUpload } from 'primereact/fileupload';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import './Rec_AddApartment.css';

const Rec_UpdateApartment = (props) => {
    const [visible, setVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // תצוגה מקדימה של תמונות
    const [showMessage, setShowMessage] = useState(false);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken.token ? jwtDecode(accesstoken.token) : null;

    const neighborhoodsData = [
        'רמת אשכול',
        'סנהדריה המורחבת',
        'בר אילן',
        'רוממה',
        'גבעת משה'
    ]

    const defaultValues = {
        monopolism: false,
        neighborhood: '',
        number_of_rooms: '',
        floor: '',
        price: '',
        yad2: false,
        description: '',
    };

    const { control, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });

    // טעינת נתוני הדירה בעת פתיחת הקומפוננטה
    useEffect(() => {
        setVisible(props.visible);

        if (props.apartment && props.visible) {
            reset({
                monopolism: props.apartment.monopolism || false,
                neighborhood: props.apartment.neighborhood || '',
                number_of_rooms: props.apartment.number_of_rooms || '',
                floor: props.apartment.floor || '',
                price: props.apartment.price || '',
                yad2: props.apartment.yad2 || false,
                description: props.apartment.description || '',
            });
            setSelectedNeighborhood(props.apartment.neighborhood || '');
            setImagePreview(props.apartment.images || []);
        }
    }, [props.apartment, props.visible, reset]);

    // קריאה לשרת לעדכון הדירה
    const onSubmit = async (data) => {
        debugger
        try {
            const res = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/apartments/update`,
                headers: { Authorization: "Bearer " + accesstoken.token },
                data: {
                    _id: props.apartment._id,
                    images: imagePreview,
                    monopolism: data.monopolism,
                    neighborhood: data.neighborhood,
                    number_of_rooms: data.number_of_rooms,
                    floor: data.floor,
                    price: data.price,
                    yad2: data.yad2,
                    description: data.description,
                    seller_id: decoded.seller_id
                },
            });
            if (res.status === 200) {
                const apartments=res.data.filter(apartment=>apartment.broker_bool===false)
                props.setApartments(apartments);
                setShowMessage(true);
                props.onHide(); 
            }
        } catch (e) {
            console.error(e);
            alert("Update resource failed");
        }
    };

    const onUpload = async (event) => {
        const uploadedFiles = event.files;
        const formData = new FormData();
        uploadedFiles.forEach((file) => formData.append('images[]', file));
        try {
            const res = await axios.post('http://localhost:7002/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploadedImageUrls = res.data.map(file => file.url);
            setImagePreview((prev) => [...prev, ...uploadedImageUrls]);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const onClear = () => {
        setImagePreview([]);
    };

    const getFormErrorMessage = (name) => (
        errors[name] && <small className="p-error">{errors[name].message}</small>
    );

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} />
        </div>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter}
                showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>עדכון דירה</h5>
                    <p>הדירה עודכנה בהצלחה!</p>
                </div>
            </Dialog>

            <Dialog visible={visible} onHide={() => props.onHide()} style={{ width: '28vw' }}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="price" control={control} render={({ field }) => (
                                        <InputNumber value={field.value} onValueChange={(e) => field.onChange(e.value)} />
                                    )} />
                                    <label htmlFor="price">מחיר</label>
                                </span>
                                {getFormErrorMessage('price')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="number_of_rooms" control={control} render={({ field }) => (
                                        <InputText type="number" {...field} />
                                    )} />
                                    <label htmlFor="number_of_rooms">מספר חדרים</label>
                                </span>
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="floor" control={control} render={({ field }) => (
                                        <InputText type="number" {...field} />
                                    )} />
                                    <label htmlFor="floor">קומה</label>
                                </span>
                            </div>

                            <div className="field">
                                <Controller name="neighborhood" control={control} render={({ field }) => (
                                    <Dropdown value={selectedNeighborhood} options={neighborhoodsData}
                                        onChange={(e) => {
                                            setSelectedNeighborhood(e.value);
                                            field.onChange(e.value);
                                        }}
                                        placeholder="בחר שכונה"
                                    />
                                )} />
                            </div>

                            <div className="field-checkbox">
                                <Controller name="monopolism" control={control} render={({ field }) => (
                                    <Checkbox checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                                )} />
                                <label htmlFor="monopolism">בלעדיות</label>
                            </div>

                            <div className="field-checkbox">
                                <Controller name="yad2" control={control} render={({ field }) => (
                                    <Checkbox checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                                )} />
                                <label htmlFor="yad2">יד 2</label>
                            </div>

                            <div>
                                <FileUpload
                                    name="images[]"
                                    url="http://localhost:7002/api/upload"
                                    multiple
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onUpload={onUpload}
                                    onClear={onClear}
                                    auto
                                    chooseLabel="הוספת תמונות"
                                    cancelLabel="ביטול"
                                />
                                <div style={{ marginTop: '20px' }}>
                                    {imagePreview && imagePreview.map((image, index) => (
                                        <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                                    ))}
                                </div>
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="description" control={control} render={({ field }) => (
                                        <InputTextarea rows={6} {...field} />
                                    )} />
                                    <label htmlFor="description">תיאור</label>
                                </span>
                            </div>

                            <Button type="submit" label="עדכן" className="mt-2" />

                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Rec_UpdateApartment;