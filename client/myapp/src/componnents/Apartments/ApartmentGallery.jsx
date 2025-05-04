import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { PrimeIcons } from 'primereact/api';

import Rec_AddApartment from '../Recourses/Rec_AddApartment';


const ApartmentGallery =() =>{
    let emptyApartment = {
        _id:null,
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
    const [ApartmentDialog, setApartmentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [layout, setLayout] = useState('grid');
    const [apartment, setApartment] = useState(emptyApartment);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:7002/api/apartments/getAllApartments'
                });

                setApartments(response.data);
            } catch (error) {
                console.error('שגיאה בקבלת הדירות:', error);
            }
        };

        fetchApartments();
    }, [accesstoken]);

    const getSeverity = (apartment) => {
        switch (apartment.inventoryStatus) {
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

    
const formatCurrency = (value) => {
    const rounded = Math.round(value);
    return `₪ ${rounded.toLocaleString('he-IL')}`;
}
const openNew = () => {
    if(!accesstoken)
        navigate(`/register`)
    setApartment(emptyApartment);
    setSubmitted(false);
    setApartmentDialog(true);
};
  const leftToolbarTemplate = () => {
         return (
             <div className="flex flex-wrap gap-2">
                 <Button label="חדש" icon="pi pi-plus" severity="success" onClick={openNew} />
             </div>
         );
     }; 
     const hideDialog = () => {
        setSubmitted(false);
        setApartmentDialog(false);
    };
    const imageBodyTemplate = (rowData) => {
        return <img src={`${rowData.images}`} alt={rowData.images} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };
    const gridItem = (apartment) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={apartment._id} 
            onClick={() => navigate(`/apartment/${apartment._id}`)}
          >
              
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <span className="text-2xl font-semibold" >{formatCurrency(apartment.price)}</span>
                        <span className="text-2xl font-semibold">{apartment.neighborhood}</span>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <div className="text-2xl ">{apartment.floor} :<b>קומה </b></div>
                        <div className="text-2xl "> <b>מספר חדרים: </b> {apartment.number_of_rooms}</div>
                        <span className="pi pi-eye icon"> { apartment.number_of_interested} </span>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (apartment, layout, index) => {
        if (!apartment) {
            return;
        }
        return gridItem(apartment);
    };

    const listTemplate = (apartments, layout) => {
        return <div className="grid grid-nogutter">{apartments.map((apartment, index) => itemTemplate(apartment, layout, index))}</div>;
    };


    return (
        <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>
            <DataView value={apartments} listTemplate={listTemplate} layout={layout}  />
            {ApartmentDialog?<Rec_AddApartment  setApartments={setApartments} setVisible={setApartmentDialog}  onHide={hideDialog} visible={ApartmentDialog}></Rec_AddApartment>:<></>}

        </div>
    )
}
export default ApartmentGallery;