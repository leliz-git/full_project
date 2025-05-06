import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ApartmentService } from './service/ApartmentService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import Rec_AddApartment from '../Recourses/Rec_AddApartment';
import Rec_UpdateApartment from '../Recourses/Rec_UpdateApartment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GalleryApartment = () => {
    let emptyApartment = {
        _id: null,
        id: null,
        neighborhood: '',
        images: null,
        description: '',
        price: 0,
        floor: 0,
        number_of_rooms: 0,
        number_of_interested: 0
    };

    const accesstoken = useSelector((state) => state.token.token);
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ApartmentDialog, setApartmentDialog] = useState(false);
    const [ApartmentDialog1, setApartmentDialog1] = useState(false);
    const [deleteApartmentDialog, setDeleteApartmentDialog] = useState(false);
    const [deleteApartmentsDialog, setDeleteApartmentsDialog] = useState(false);
    const [apartment, setApartment] = useState(emptyApartment);
    const [selectedApartments, setSelectedApartments] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    // פונקציות חסרות שהוגדרו מחדש
    const confirmDeleteApartment = async (Apartment) => {
        try {
            const res = await axios({
                method: 'delete',
                url: `http://localhost:7002/api/apartments/delete`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: { _id: Apartment._id }
            });

            if (res.status === 200) {
                console.log(res);
                setApartments((prev) => prev.filter((a) => a._id !== Apartment._id));
                setDeleteApartmentDialog(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmCompleteApartment = async (Apartment) => {
        try {
            const res = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/apartments/complete`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: { _id: Apartment._id }
            });

            if (res.status === 200) {
                console.log(res);
                setApartments((prev) => prev.filter((a) => a._id !== Apartment._id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="פרסום" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="יצוא" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0"></h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="חיפוש..." />
            </IconField>
        </div>
    );

    const priceBodyTemplate = (rowData) => {
        return rowData.price.toLocaleString('en-US', { style: 'currency', currency: 'ILS' });
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.images?.map((url, index) => (
                    <img
                        key={index}
                        src={`${url}`}
                        alt={url}
                        className="shadow-2 border-round"
                        style={{ width: '64px' }}
                    />
                ))}
            </div>
        );
    };

    const hideDialog = () => {
        setSubmitted(false);
        setApartmentDialog(false);
    };

    const hideDialog1 = () => {
        setSubmitted(false);
        setApartmentDialog1(false); // סגירת הדיאלוג
    };

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:7002/api/apartments/getAllApartmentsByBroker',
                    headers: { Authorization: "Bearer " + accesstoken },
                });

                setApartments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching apartments:', error);
                setLoading(false);
            }
        };

        fetchApartments();
    }, [accesstoken]);
    console.log(apartments)
    const openNew = () => {
        setApartment(emptyApartment); // איפוס הדירה לבחירה חדשה
        setSubmitted(false); // איפוס מצב ההגשה
        setApartmentDialog(true); // פתיחת הדיאלוג להוספת דירה
    };
    
    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV(); // ייצוא הנתונים בקובץ CSV
        }
    };
    
    const editApartment = (Apartment) => {
        setApartment({ ...Apartment }); // שמירת הדירה שנבחרה לעריכה
        setApartmentDialog1(true); // פתיחת הדיאלוג לעריכת הדירה
    };
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    ref={dt}
                    value={apartments}
                    selection={selectedApartments}
                    onSelectionChange={(e) => setSelectedApartments(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Apartments"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="price" header="מחיר" body={priceBodyTemplate}></Column>
                    <Column field="neighborhood" header="שכונה"></Column>
                    <Column field="images" header="תמונות" body={imageBodyTemplate}></Column>
                    <Column field="number_of_rooms" header="מספר חדרים"></Column>
                    <Column field="floor" header="קומה"></Column>
                    <Column field="description" header="תיאור"></Column>
                    <Column
                        body={(rowData) => (
                            <React.Fragment>
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    outlined
                                    severity="danger"
                                    onClick={() => confirmDeleteApartment(rowData)}
                                />
                                <Button
                                    icon="pi pi-upload"
                                    rounded
                                    outlined
                                    className="mr-2"
                                    onClick={() => confirmCompleteApartment(rowData)}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    rounded
                                    outlined
                                    className="mr-2"
                                    onClick={() => editApartment(rowData)}
                                />
                                <Button
                                    icon="pi pi-comments"
                                    rounded
                                    outlined
                                    className="mr-2"
                                    tooltip="פתח צ'אט"
                                    onClick={() => navigate(`/chat?apartmentId=${rowData._id}`)}
                                />
                            </React.Fragment>
                        )}
                        exportable={false}
                        style={{ minWidth: '12rem' }}
                    ></Column>
                </DataTable>
            </div>
            {ApartmentDialog?<Rec_AddApartment  setApartments={setApartments} setVisible={setApartmentDialog}  onHide={hideDialog} visible={ApartmentDialog}></Rec_AddApartment>:<></>}
            {ApartmentDialog1 ? (
    <Rec_UpdateApartment
        apartment={apartment}
        setApartments={setApartments}
        setVisible={setApartmentDialog1}
        onHide={hideDialog1} // מעביר את hideDialog1
        visible={ApartmentDialog1}
    />
) : null}
        </div>
    );
};

export default GalleryApartment;