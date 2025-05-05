import React, { useEffect, useState ,useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import axios from 'axios';

const ApartmentDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const isFetching = useRef(false);

const fetchApartment = async () => {
      try {
        const response = await axios.get(`http://localhost:7002/api/apartments/getbyid/${_id}`);
        setApartment(response.data);

      } catch (error) {
        console.error('Error fetching apartment details:', error);
      }
    };
  useEffect(() => {
    if (!apartment && !isFetching.current) {
      isFetching.current = true;
      fetchApartment();
    }}, [_id]);
  
  const responsiveOptions = [
    { breakpoint: '991px', numVisible: 4 },
    { breakpoint: '767px', numVisible: 3 },
    { breakpoint: '575px', numVisible: 1 },
  ];

  if (!apartment) {
    return <div>Loading...</div>;
  }

  const images = Array.isArray(apartment.images) ? apartment.images : [apartment.images];

  return (
    <div className="p-4" style={{ position: 'relative', direction: 'rtl', textAlign: 'right', fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f7f7' }}>
      {/* Back Button */}
      <Button
        label="חזור"
        icon="pi pi-arrow-right"
        className="p-button-rounded p-button-outlined"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #ddd',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontWeight: 'bold',
        }}
        onClick={() => navigate(-1)}
      />

      {/* Apartment Details Section */}
      <div className="text-center mb-4">
        {images.length > 0 && (

          <Galleria
            value={images}
            responsiveOptions={responsiveOptions}
            numVisible={5}
            style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            // item={(item) => (
            //   <img
            //     src={item}
            //     alt="Apartment"
            //     style={{
            //       width: '100%',
            //       maxHeight: '400px',
            //       objectFit: 'cover',
            //     }}
            //   />
            // )}
            thumbnail={(item) => (
              <img
                src={item}
                alt="Thumbnail"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          />
        )}
      </div>

      {/* Apartment Info Section */}
      <div
        className="p-4"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'right',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      >
        {/* Neighborhood and Description */}
        <h2 className="text-secondary mb-2" style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>
          {apartment.neighborhood}
        </h2>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginBottom: '20px' }} />
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '20px' }}>
          {apartment.description}
        </p>

        {/* Additional Details */}
        <ul className="list-none p-0 m-0" style={{ lineHeight: '2rem' }}>
          <li className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="pi pi-money-bill" style={{ fontSize: '1.5rem', color: '#007bff' }}></i>
            <span style={{ fontSize: '1.2rem', color: '#333' }}><strong>מחיר:</strong> ₪{apartment.price.toLocaleString('he-IL')}</span>
          </li>
          <li className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="pi pi-building" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
            <span style={{ fontSize: '1.2rem', color: '#333' }}><strong>קומה:</strong> {apartment.floor}</span>
          </li>
          <li className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="pi pi-home" style={{ fontSize: '1.5rem', color: '#ffc107' }}></i>
            <span style={{ fontSize: '1.2rem', color: '#333' }}><strong>מספר חדרים:</strong> {apartment.number_of_rooms}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApartmentDetails;