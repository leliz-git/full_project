import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { PrimeIcons } from 'primereact/api';

import Rec_AddApartment from '../Recourses/Rec_AddApartment';

const ApartmentGallery = () => {
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
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [ApartmentDialog, setApartmentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [layout, setLayout] = useState('grid');
    const [apartment, setApartment] = useState(emptyApartment);
    const [searchDialogVisible, setSearchDialogVisible] = useState(false);
    const [searchFields, setSearchFields] = useState({
        neighborhood: '',
        minPrice: '',
        maxPrice: '',
        rooms: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:7002/api/apartments/getAllApartments'
                });
                setApartments(response.data);
                setFilteredApartments(response.data);
            } catch (error) {
                console.error('שגיאה בקבלת הדירות:', error);
            }
        };

        fetchApartments();
    }, [accesstoken, filteredApartments]);

    const formatCurrency = (value) => {
        const rounded = Math.round(value);
        return `₪ ${rounded.toLocaleString('he-IL')}`;
    };

    const openNew = () => {
        if (!accesstoken) navigate(`/register`);
        setApartment(emptyApartment);
        setSubmitted(false);
        setApartmentDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="פרסום" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="חפש" icon="pi pi-search" onClick={() => setSearchDialogVisible(true)} />
            </div>
        );
    };

    const hideDialog = () => {
        setSubmitted(false);
        setApartmentDialog(false);
    };

    const gridItem = (apartment) => {
        return (
            <div
                className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2"
                key={apartment._id}
                onClick={() => navigate(`/apartment/${apartment._id}`)}
            >
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <span className="text-2xl font-semibold">{formatCurrency(apartment.price)}</span>
                        <span className="text-2xl font-semibold">{apartment.neighborhood}</span>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <div className="text-2xl">
                            <b>קומה: </b>
                            {apartment.floor}
                        </div>
                        <div className="text-2xl">
                            <b>מספר חדרים: </b> {apartment.number_of_rooms}
                        </div>
                        <span className="pi pi-eye icon"> {apartment.number_of_interested} </span>
                    </div>
                </div>
            </div>
        );
    };

    const filterApartments = () => {
        const { neighborhood, minPrice, maxPrice, rooms } = searchFields;
        let filtered = apartments;

        if (neighborhood.trim()) {
            filtered = filtered.filter((apartment) =>
                apartment.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
            );
        }
        if (minPrice) {
            filtered = filtered.filter((apartment) => apartment.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter((apartment) => apartment.price <= parseFloat(maxPrice));
        }
        if (rooms) {
            filtered = filtered.filter((apartment) => apartment.number_of_rooms === parseInt(rooms, 10));
        }

        setFilteredApartments(filtered);
        resetSearchFields();
        setSearchDialogVisible(false);
    };

    const resetSearchFields = () => {
        setSearchFields({
            neighborhood: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
        });
    };

    const handleFieldChange = (field, value) => {
        setSearchFields((prevFields) => ({
            ...prevFields,
            [field]: value,
        }));
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            filterApartments();
        }
    };

    return (
        <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataView value={filteredApartments} layout={layout} itemTemplate={gridItem} />

            <Dialog
                visible={searchDialogVisible}
                style={{ width: '50vw' }}
                header="חיפוש דירות"
                modal
                onHide={() => {
                    resetSearchFields();
                    setSearchDialogVisible(false);
                }}
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="neighborhood">שכונה</label>
                        <InputText
                            id="neighborhood"
                            value={searchFields.neighborhood}
                            onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
                            onKeyDown={handleEnterKey}
                            placeholder="הזן שכונה"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="minPrice">מחיר מינימום</label>
                        <InputNumber
                            id="minPrice"
                            value={searchFields.minPrice}
                            onValueChange={(e) => handleFieldChange('minPrice', e.value)}
                            onKeyDown={handleEnterKey}
                            placeholder="₪"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="maxPrice">מחיר מקסימום</label>
                        <InputNumber
                            id="maxPrice"
                            value={searchFields.maxPrice}
                            onValueChange={(e) => handleFieldChange('maxPrice', e.value)}
                            onKeyDown={handleEnterKey}
                            placeholder="₪"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="rooms">מספר חדרים</label>
                        <InputNumber
                            id="rooms"
                            value={searchFields.rooms}
                            onValueChange={(e) => handleFieldChange('rooms', e.value)}
                            onKeyDown={handleEnterKey}
                            placeholder="חדרים"
                        />
                    </div>
                    <div className="flex justify-content-end mt-3">
                        <Button label="בצע סינון" icon="pi pi-check" onClick={filterApartments} />
                    </div>
                </div>
            </Dialog>

            {ApartmentDialog && (
                <Rec_AddApartment
                    setApartments={setApartments}
                    setVisible={setApartmentDialog}
                    onHide={hideDialog}
                    visible={ApartmentDialog}
                />
            )}
        </div>
    );
};

export default ApartmentGallery;