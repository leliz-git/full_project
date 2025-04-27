// import React, { useEffect, useState} from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { jwtDecode } from 'jwt-decode';
// import { Carousel } from 'primereact/carousel'; // גלריית תמונות
// import 'primereact/resources/themes/lara-light-indigo/theme.css'; // עיצוב
// import 'primereact/resources/primereact.min.css'; // עיצוב
// import 'primeicons/primeicons.css'; // אייקונים
// import './ApartmentsGallery.css'; // נוכל להוסיף CSS לפי הצורך



// const ApartmentGallery = () => {
//     const [apartments, setApartments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;

//     useEffect(() => {
//         const fetchApartments = async () => {
//             try {
//                 const response = await axios({
//                     method: 'GET',
//                     url: 'http://localhost:7002/api/apartments/getAllApartments',
//                     headers: { Authorization: "Bearer " + accesstoken },
//                 });

//                 setApartments(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching apartments:', error);
//                 setLoading(false);
//             }
//         };

//         fetchApartments();
//     }, [accesstoken]);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="gallery-container">
//             {apartments.map((apartment) => (
//                 <div key={apartment.id} className="gallery-item">
//                     <Card
//                         title={`מחיר: ₪${apartment.price}`}
//                         subTitle={apartment.description}
//                         className="card-container"
//                     >
//                         <div className="apartment-details">
//                             <p><strong>מספר חדרים:</strong> {apartment.number_of_rooms}</p>
//                             <p><strong>קומה:</strong> {apartment.floor}</p>
//                             <p>{apartment.neighborhood}: <strong>שכונה</strong> </p>
//                             <p><strong>מספר מתעניינים:</strong> {apartment.number_of_interested}</p>
//                         </div>
//                     </Card>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ApartmentGallery;