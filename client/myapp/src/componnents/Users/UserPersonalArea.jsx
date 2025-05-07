import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPersonalArea.css'; // ייבוא קובץ CSS לעיצוב
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice';

const UserPersonalArea = () => {
     const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const accesstoken = useSelector((state) => state.token.token);
    // const decoded = accesstoken?.token ? jwtDecode(accesstoken.token) : null;
    console.log(accesstoken);

    let decoded = null;

    if (accesstoken?.token && typeof accesstoken?.token === 'string') {
        try {
            decoded = jwtDecode(accesstoken?.token);
            console.log("Decoded token:", decoded);
        } catch (error) {
            console.error("Error decoding token:", error.message);
        }
    } else {
        console.error("Invalid or missing token.");
    }

    const _id = decoded?._id ? decoded._id : null;
    console.log("id", _id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `http://localhost:7002/api/users/getbyid/${_id}`,
                    headers: { Authorization: `Bearer ${accesstoken?.token}` },
                });

                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('שגיאה בשליפת המשתמש:', error);
            }
        };

        if (_id) {
            fetchUser();
        }
    }, [_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios({
                method: 'PUT',
                url: `http://localhost:7002/api/users/update`,
                headers: { Authorization: "Bearer " + accesstoken.token },
                data: {
                    _id: _id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password
                },
            });
            if (response.status === 200) {
                // שליפת המשתמש המעודכן מהרשימה שהוחזרה
                const newUser = response.data.users.find(user => user._id === _id);
                setUser(newUser);
                console.log("user", user);
    console.log("decoded", decoded)
    
                // עדכון Redux Toolkit עם המידע החדש
                const updatedDecoded = {
                         ...decoded,       
                    name: user.name,
                    username: user.username,
                    email: user.email,
                };
    console.log( "1",updatedDecoded.name)
                // שליחת המידע המעודכן ל-Redux
                dispatch(setToken({
                    token: accesstoken.token, // שמירת הטוקן המקורי
                    decoded:updatedDecoded
                    , // עדכון המידע המפוענח
                }));
                
                console.log( "2",decoded.name)
                setIsEditing(false);
                console.log('עודכן בהצלחה:', newUser, decoded.name);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("שם המשתמש כבר קיים");
            } else {
                console.error('שגיאה בעדכון המשתמש:', error);
            }
        }
    };

    if (!user) return <p>טוען נתונים...</p>;

    return (
        <div className="user-personal-area">
            <h2 className="title">האזור האישי שלי</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">שם:</label>
                        <input
                            id="name"
                            className="form-input"
                            type="text"
                            name="name"
                            value={user.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">שם משתמש:</label>
                        <input
                            id="username"
                            className="form-input"
                            type="text"
                            name="username"
                            value={user.username || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">אימייל:</label>
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            name="email"
                            value={user.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">סיסמה:</label>
                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            name="password"
                            value={user.password || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-save">שמור</button>
                        {/* <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => setIsEditing(false)}
                        >
                            בטל
                        </button> */}
                    </div>
                </form>
            ) : (
                <div className="user-details">
                    <p><strong>שם:</strong> {user.name}</p>
                    <p><strong>שם משתמש:</strong> {user.username}</p>
                    <p><strong>אימייל:</strong> {user.email}</p>
                    <p><strong>סיסמה:</strong> ******</p>
                    <button
                        className="btn btn-edit"
                        onClick={() => setIsEditing(true)}
                    >
                        ערוך פרטים
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserPersonalArea;