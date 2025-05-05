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
import axios from 'axios';

const GalleryApartment = () => {
    let emptyApartment = {
        _id:null,
        id: null,
        neighborhood: '',
        images: null,
        description: '',
        // category: null,
        price: 0,
        floor: 0,
        number_of_rooms: 0,
        number_of_interested: 0
        // inventoryStatus: 'INSTOCK'
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
    const toast = useRef(null);
    const dt = useRef(null);

    // useEffect(() => {
    //     ApartmentService.getApartments().then((data) => setApartments(data));
    // }, []);
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


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'ILS' });
    };

    const openNew = () => {
        setApartment(emptyApartment);
        setSubmitted(false);
        setApartmentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setApartmentDialog(false);
    };
    const hideDialog1 = () => {
        setSubmitted(false);
        setApartmentDialog1(false);
    };

    const hideDeleteApartmentDialog = () => {
        setDeleteApartmentDialog(false);
    };

    const hideDeleteApartmentsDialog = () => {
        setDeleteApartmentsDialog(false);
    };

    const saveApartment = () => {
        setSubmitted(true);

        if (apartment.name.trim()) {
            let _Apartments = [...apartments];
            let _Apartment = { ...apartment };

            if (apartment.id) {
                const index = findIndexById(apartment.id);

                _Apartments[index] = _Apartment;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Apartment Updated', life: 3000 });
            } else {
                _Apartment.id = createId();
                _Apartment.image = 'Apartment-placeholder.svg';
                _Apartments.push(_Apartment);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Apartment Created', life: 3000 });
            }

            setApartments(_Apartments);
            setApartmentDialog(false);
            setApartment(emptyApartment);
        }
    };

    const editApartment = (Apartment) => {
        
        setApartment({ ...Apartment });
        setApartmentDialog1(true);
    };

    const confirmCompleteApartment=async(Apartment)=>{
        try {
            const res = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/apartments/complete`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: { _id: Apartment._id }
            });
    
            if (res.status === 200) {
                console.log(res);
                setApartments(prev => prev.filter(a => a._id !== Apartment._id)); // מחיקה מהסטייט
            }
        } catch (error) {
            console.error(error);
        }
    }

    const confirmDeleteApartment =async (Apartment) => {
            try {
                const res = await axios({
                    method: 'delete',
                    url: `http://localhost:7002/api/apartments/delete`,
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: { _id: Apartment._id }
                });
        
                if (res.status === 200) {
                    console.log(res);
                    setApartments(prev => prev.filter(a => a._id !== Apartment._id)); // מחיקה מהסטייט
                    setDeleteApartmentDialog(true); // פתיחת דיאלוג אם צריך
                }
            } catch (error) {
                console.error(error);
            }
        };
        
       
    
       
    

    const deleteApartment = () => {
        let _Apartments = apartments.filter((val) => val.id !== apartment.id);

        setApartments(_Apartments);
        setDeleteApartmentDialog(false);
        setApartment(emptyApartment);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Apartment Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < apartments.length; i++) {
            if (apartments[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteApartmentsDialog(true);
    };

    const deleteSelectedApartments = () => {
        let _Apartments = apartments.filter((val) => !selectedApartments.includes(val));

        setApartments(_Apartments);
        setDeleteApartmentsDialog(false);
        setSelectedApartments(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Apartments Deleted', life: 3000 });
    };

    // const onCategoryChange = (e) => {
    //     let _Apartment = { ...apartment };

    //     _Apartment['category'] = e.value;
    //     setApartment(_Apartment);
    // };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Apartment = { ...apartment };

        _Apartment[`${name}`] = val;

        setApartment(_Apartment);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Apartment = { ...apartment };

        _Apartment[`${name}`] = val;

        setApartment(_Apartment);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedApartments || !selectedApartments.length} /> */}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
       return  <div>{
       rowData.images.map((url, index) => (

         <img src={`${url}`} alt={url} className="shadow-2 border-round" style={{ width: '64px' }} />
    ))}
</div>
    };
// src={`https://primefaces.org/cdn/primereact/images/Apartment/${rowData.image}`}
    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-upload" rounded outlined className="mr-2" onClick={() => confirmCompleteApartment(rowData)} />
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editApartment(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteApartment(rowData)} />
                
            </React.Fragment>
        );
    };

    const getSeverity = (Apartment) => {
        switch (Apartment.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0"></h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const ApartmentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveApartment} />
        </React.Fragment>
    );
    const deleteApartmentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteApartmentDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteApartment} />
        </React.Fragment>
    );
    const deleteApartmentsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteApartmentsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedApartments} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={apartments} selection={selectedApartments} onSelectionChange={(e) => setSelectedApartments(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Apartments" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="price" header="price" body={priceBodyTemplate} ></Column>
                    <Column field="neighborhood" header="neighborhood" ></Column>
                    <Column field="images" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="number_of_rooms" header="number of rooms"  ></Column>
                    <Column field="floor" header="floor" ></Column>
                    <Column field="number_of_interested" header="number of interests" ></Column>
                    <Column field="description" header="description" ></Column>
                    {/*<Column field="_id" header="_id" ></Column>
                    {/* <Column field="inventoryStatus" header="Status" sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

           

            {/* <Dialog visible={deleteApartmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteApartmentDialogFooter} onHide={hideDeleteApartmentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {apartment && (
                        <span>
                            Are you sure you want to delete <b>{apartment.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog> */}

            {ApartmentDialog?<Rec_AddApartment  setApartments={setApartments} setVisible={setApartmentDialog}  onHide={hideDialog} visible={ApartmentDialog}></Rec_AddApartment>:<></>}
            {ApartmentDialog1?<Rec_UpdateApartment apartment={apartment} setApartments={setApartments} setVisible={setApartmentDialog1}  onHide={hideDialog1} visible={ApartmentDialog1}></Rec_UpdateApartment>:<></>}

            {/* <Dialog visible={deleteApartmentsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteApartmentsDialogFooter} onHide={hideDeleteApartmentsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {apartment && <span>Are you sure you want to delete the selected Apartments?</span>}
                </div>
            </Dialog> */}
        </div>
    );

}

export default GalleryApartment;
