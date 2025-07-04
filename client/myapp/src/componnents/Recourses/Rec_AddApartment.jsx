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
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'



import './Rec_AddApartment.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';


const Rec_AddApartment = (props) => {
    const [visible, setVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);  // למעקב אחרי התמונה שהועלתה
    const [showMessage, setShowMessage] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [images, setImages] = useState([]);
    const accesstoken = useSelector((state) => state.token.token);
    // const user = useSelector((state) => state.token.user);
    const decoded = accesstoken.token ? jwtDecode(accesstoken.token) : null;
    const [formData, setFormData] = useState({});
        const toastTopCenter = useRef(null);
    
    const neighborhoodsData = [
        'רמת אשכול',
        'סנהדריה המורחבת',
        'בר אילן',
        'רוממה',
        'גבעת משה'
    ]
    const toast = useRef(null);

    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);




    useEffect(() => {
        setVisible(props.visible)
        // עדכון ה-state עם המערך
        setNeighborhoods(neighborhoodsData);
    }, []); // [] כדי שהאנימציה תתרחש בפעם הראשונה בלבד

    useEffect(() => {
    }, []);

   
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

    const updateRole = async () => {
        try {
            const res = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/users/updateRole`,
                headers: { Authorization: "Bearer " + accesstoken?.token },
                data: { _id: decoded?._id }
            });

            if (res.status === 200) {
                console.log(res);
                // alert("change role")
            }
        } catch (error) {
            alert("אופס, שגיאה לא צפויה. נסה שוב בעוד מספר רגעים")
            console.error(error);
        }
    };



    const onSubmit = async (data) => {
        const payload = {
            ...data,
            images}
        // debugger
        try {

            console.log(data);
            console.log(accesstoken)
            const res = await axios(
                {
                    method: 'POST',
                    url: 'http://localhost:7002/api/apartments/add',
                    headers: { Authorization: "Bearer " + accesstoken?.token },
                    data: {
                        images: images,
                        monopolism: data.monopolism,
                        neighborhood: data.neighborhood,
                        number_of_rooms: data.number_of_rooms,
                        floor: data.floor,
                        price: data.price,
                        yad2: data.yad2,
                        description: data.description,
                        // seller_id: decoded.seller_id 
                    },
                }
            )

            if (res.status === 200) {
                await updateRole()
               if(decoded.roles==="Broker")
               {
                const apartments=res.data.filter(apartment=>apartment.broker_bool===false)
                props.setApartments(apartments);
                setShowMessage(true)
               }
               else if (decoded.roles==="Seller" || decoded.roles==="Buyer")
               {
                const apartments=res.data.filter(apartment=>apartment.broker_bool===true)
                props.setApartments(apartments);
                setShowMessage(true)
               }

             
        
                
                //  props.setVisible(false);
            }

            else {

            }
        } catch (e) {
            
            console.error(e)
            alert("הוספת דירה נכשלה")
        }
    };


    const [files, setFiles] = useState([]);



    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text"
        autoFocus onClick={() => { setShowMessage(false); props.setVisible(false) }} ></Button></div>;

    // const onUpload = () => {
    //     toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    // };





    // פונקציה כדי לקבל את התמונה ולהציג תצוגה מקדימה
    const onSelect = (e) => {
        // לוקחים את הקובץ הראשון מתוך התמונות שנבחרו
        const file = e.files[0];
        console.log(URL.createObjectURL(file));
        const imageUrl = URL.createObjectURL(file);  // יוצרים URL זמני לתמונה
        setImagePreview(imageUrl);  // מעדכנים את מצב התמונה עם ה-URL החדש
    };

    // const onUpload = (e) => {

    //     toast.current.show({
    //         severity: 'success',
    //         summary: 'העלאה הושלמה',
    //         detail: 'התמונה הועלתה בהצלחה',
    //         life: 3000
    //     })
    // }
    
    const onUpload = async (event) => {
        const uploadedFiles = event.files;
    
        // Create FormData object
        const formData = new FormData();
        uploadedFiles.forEach((file) => formData.append('images[]', file));
    
        try {
          const res = await axios.post('http://localhost:7002/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          const uploadedImageUrls = res.data.map((file) => file.url);
          
          setImages((prevImages) => [...prevImages, ...uploadedImageUrls]);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      };
    
      // Function to handle form submission
      
    
    // Function to handle file upload
    // const onUpload = (event) => {
    //   const uploadedFiles = event.files || []; // Ensure event.files exists
    //   setImages((prevImages) => {
    //     // Check for duplicates based on file name
    //     const newFiles = uploadedFiles.filter(
    //       (uploadedFile) => !prevImages.some((image) => image.name === uploadedFile.name)
    //     );
    //     return [...prevImages, ...newFiles];
    //   });
    //   console.log('Uploaded images:', uploadedFiles);
    // };
  
    // Function to clear all uploaded images
    const onClear = () => {
      setImages([]);
      console.log('Upload canceled');
    };
    
    


    return (

        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter}
                showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>הוספת דירה</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        הדירה שלך נוספה, בהצלחה!!!
                        <b>{formData.name}</b> ;
                    </p>
                </div>
            </Dialog>



            <Dialog visible={visible} onHide={() => props.onHide()} style={{ width: '28vw', margin: '0', marginTop: '0', padding: '0' }}
            >


                <div className="flex justify-content-center">
                    <div className="card">
                        {/* <h5 className="text-center">Register</h5> */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="price" control={control} render={({ field, fieldState }) => (
                                        <InputNumber min="1" step="1" value={field.value} id={field.name} inputId="integeronly" autoFocus
                                            onValueChange={(e) => (field.onChange(e.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))} />
                                    )} />
                                    <label htmlFor="price">מחיר</label>
                                </span>
                                {getFormErrorMessage('description')}
                            </div>


                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="number_of_rooms" control={control} render={({ field, fieldState }) => (
                                        <InputText type="number" min="1" step="1" id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, number_of_rooms: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="date">מספר חדרים</label>
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
                                    <label htmlFor="date">קומה</label>
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
                                            placeholder="שכונה"
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
                                <label htmlFor="monopolism" className={classNames({ 'p-error': errors.accept })}>בלעדיות </label>
                            </div>


                            <div className="field-checkbox">
                                <Controller name="yad2" control={control} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)}
                                        checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="yad2" className={classNames({ 'p-error': errors.accept })}>יד 2 </label>
                            </div>
                                                        
                            {/* <Toast ref={toast}></Toast>
                            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} auto chooseLabel="Browse" />
                           */}
                                       {/* <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} /> */}

                            <div>
                            <div>
 
     
      
     
    </div>
    <div>
      <FileUpload
        name="images[]"
        url="http://localhost:7002/api/upload" // Replace with the correct API endpoint
        multiple // Allow selecting multiple files
        accept="image/*" // Accept only image files
        maxFileSize={1000000} // Max file size: 1MB
        onUpload={onUpload}
        onClear={onClear}
        chooseLabel="הוספת תמונות"
        cancelLabel="ביטול"
        // uploadLabel="Upload"
        auto
      />
      {/* Display the list of uploaded images */}
      <div>
        {images.length > 0 && (
          <div>
            {/* <h3>Uploaded Images:</h3> */}
            <ul>
              {images.map((image, index) => (
                <li key={index}>{image.name}</li> // Display image names
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
   
                                {/* <Toast ref={toast}></Toast> */}

                                {/* רכיב FileUpload */}
                                {/* <FileUpload
                                    mode="basic"
                                    name="demo[]"
                                    url="/api/upload"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onSelect={onSelect}  // פונקציה שתופסת את התמונות שנבחרו


                                    // onUpload={onUpload}
                                    auto
                                    chooseLabel="image"
                                /> */}

                                {/* תצוגה מקדימה של התמונה אם נבחרה */}
                           
                            </div>

                            <br></br>



                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="description" control={control} render={({ field, fieldState }) => (
                                        <InputTextarea rows={8} cols={30} id={field.name} {...field} autoFocus
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onValueChange={(e) => (field.onChange(e.target.value),
                                                setDefaultValues(prevValues => ({ ...prevValues, number_of_rooms: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="date">תיאור</label>
                                </span>
                                {getFormErrorMessage('description')}
                            </div>


                            <br></br>
                            <br></br>
                            <Button type="button" label="איפוס" onClick={() => (reset())} className='reset1'></Button>
                            <Button type="submit" label="פרסום" className="mt-2"

                            />

                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};


export default Rec_AddApartment;


