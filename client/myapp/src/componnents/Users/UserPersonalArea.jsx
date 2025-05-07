import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';


// import './UserProfile.css';

const UserPersonalArea = () => {
    //   const { id } = useParams();
    
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const accesstoken = useSelector((state) => state.token.token)
    console.log(accesstoken)
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
    console.log("id", _id)

    useEffect(() => {
        // פונקציה אסינכרונית בתוך useEffect
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

        // קריאה לפונקציה האסינכרונית
        if (_id) {
            fetchUser();
        }
    }, [_id]); // תלות ב-_id וב-accesstoken



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
                
                const newUser = response.data.find(user => user._id === _id)
                setUser(newUser);
                console.log("user", user)

                setIsEditing(false);
                console.log('עודכן בהצלחה:', newUser);
            }
        } catch (error) {
            if(error.response && error.response===409)
                alert("duplicate username")
            else{
                            console.error('שגיאה בעדכון המשתמש:', error);
            }
        }
    }
    //     
    if (!user) return <p>טוען נתונים...</p>;

    return (
        <div className="user-profile">
            <h2>האזור האישי שלי</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="user-form">
                    <label>
                        שם :
                        <input type="text" name="name" value={user.name || ''} onChange={handleChange} />
                    </label>
                    <label>
                        שם משתמש:
                        <input type="text" name="username" value={user.username || ''} onChange={handleChange} newUser />
                    </label>
                    <label>
                        אימייל:
                        <input type="email" name="email" value={user.email || ''} onChange={handleChange} required />
                    </label>
                    <label>
                        סיסמה:
                        <input type="password" name="password" value={user.password || ''} onChange={handleChange} required />
                    </label>
                    <div className="buttons">
                        <button type="submit">שמור</button>
                        <button type="button" onClick={() => setIsEditing(false)}>בטל</button>
                    </div>
                </form>
            ) : (
                <div className="user-details">
                    <p><strong>שם:</strong> {user.name}</p>
                    <p><strong>שם משתמש:</strong> {user.username}</p>
                    <p><strong>אימייל:</strong> {user.email}</p>
                    <p><strong>סיסמה:</strong> ******</p>
                    <button onClick={() => setIsEditing(true)}>ערוך פרטים</button>
                </div>
            )}
        </div>
    );
};

export default UserPersonalArea;