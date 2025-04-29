
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
import Rec_AddApartment from '../Recourses/Rec_AddApartment';


const ApartmentGallery =() =>{
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
    const [ApartmentDialog, setApartmentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [layout, setLayout] = useState('grid');
    const [apartment, setApartment] = useState(emptyApartment);
    const navigate = useNavigate()
 
    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:7002/api/apartments/getAllApartments'
                    // ,
                    // headers: { Authorization: "Bearer " + accesstoken },
                });

                setApartments(response.data);
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching apartments:', error);
                // setLoading(false);
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
                 <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                 {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedApartments || !selectedApartments.length} /> */}
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
                            {/* <i className="pi pi-tag"></i> */}
                        </div>
                        {/* <Tag value={apartment.inventoryStatus} severity={getSeverity(apartment)}></Tag> */}
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {/* <img className="w-9 shadow-2 border-round" body={imageBodyTemplate(apartment.images)}  /> */}
                        <span className="text-2xl font-semibold" >{formatCurrency(apartment.price)}</span>
                        <span className="text-2xl font-semibold">{apartment.neighborhood}</span>
                        {/* <Rating value={apartment.number_of_interested} readOnly cancel={false}></Rating> */}
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <div className="text-2xl "><b>floor: </b>{apartment.floor}</div>
                        <div className="text-2xl "> <b> number of rooms: </b> {apartment.number_of_rooms}</div>
                        {/* <div className="text-2xl ">{apartment.description}</div> */}
                      
                        
                        {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={apartment.inventoryStatus === 'OUTOFSTOCK'} ></Button> */}
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
export default ApartmentGallery        