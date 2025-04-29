
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import { Card } from 'primereact/card';

const ApartmentDetails = () => {
  const { _id } = useParams();
  
  const navigate = useNavigate();
  const [apartment, setApartment] = useState({
    _id: null,
    neighborhood: '',
    images: null,
    description: '',
    price: 0,
    floor: 0,
    number_of_rooms: 0,
    number_of_interested: 0
  });

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await axios.get(`http://localhost:7002/api/apartments/getbyid/${_id}`);
        setApartment(response.data);
      } catch (error) {
        console.error('Error fetching apartment details:', error);
      }
    };

    if (_id) {
      fetchApartment();
    }
  }, [_id]);

  const responsiveOptions = [
    {
      breakpoint: '991px',
      numVisible: 4
    },
    {
      breakpoint: '767px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];
console.log(apartment)
  if (!apartment ) {
    return <div>Loading...</div>;
  }

  const images = Array.isArray(apartment.images) ? apartment.images : [apartment.images];

  return (
    <div className="p-4">
      <Button label="חזור" icon="pi pi-arrow-left" className="p-button-text mb-4" onClick={() => navigate(-1)} />

      <Card title={apartment.neighborhood} className="mb-4">
        <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '640px', margin: '0 auto' }}
          item={(item) => <img src={item} alt="Apartment" style={{ width: '100%' }} />}
          thumbnail={(item) => <img src={item} alt="Thumbnail" style={{ width: '100%' }} />} />
      </Card>

      <div className="grid">
        <div className="col-12 md:col-6">
          <Card className="p-4">
            <h2>פרטים</h2>
            <p><b>מחיר:</b> ₪{apartment.price.toLocaleString('he-IL')}</p>
            <p><b>קומה:</b> {apartment.floor}</p>
            <p><b>מספר חדרים:</b> {apartment.number_of_rooms}</p>
            <p><b>תיאור:</b> {apartment.description}</p>
          </Card>
        </div>
        <div className="col-12 md:col-6">
          <Card className="p-4 text-center">
            <h2>מספר מתעניינים</h2>
            <div className="text-6xl font-bold text-primary">
              {apartment.number_of_interested}
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default ApartmentDetails;
