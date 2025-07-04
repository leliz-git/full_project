import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { setToken, logOut } from '../../redux/tokenSlice';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const FormReg = () => {
  const [formData, setFormData] = useState({});
  const accesstoken = useSelector((state) => state.token.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const decoded = accesstoken?.token ? jwtDecode(accesstoken.token) : null;

  const defaultValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    accept: false,
  };

  const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:7002/api/auth/register", {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.status === 201) {
        setFormData(data);
        const token = res.data.accessToken;
        dispatch(setToken({ token: res.data.accessToken }));
        // alert("ההרשמה בוצעה בהצלחה!");
        navigate("/Apartments");
      }
    } catch (e) {
      if (e.response && e.response.status === 409) {
        alert("שם משתמש זה כבר קיים");
      } else {
        console.error(e);
        alert("הרשמה נכשלה");
      }
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row-reverse", // מוודא שהרכיבים יתחלפו
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Left Section: Slogan and Icons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // מתעלם מ-RTL ומצמיד את התוכן לשמאל
          justifyContent: "center",
          width: "100%",
          maxWidth: "500px",
          marginRight: "20px", // מרווח מימין במקום משמאל
          textAlign: "left", // טקסט מיושר לשמאל
        }}
      >
        <h2
          style={{
            color: "#333",
            fontSize: "1.8rem",
            fontWeight: "600",
            marginBottom: "20px",
            textAlign: "left", // טקסט מיושר לשמאל
          }}
        >
          .למכור. לקנות. לגדול. – הכל במקום אחד
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "40px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <i className="pi pi-comments" style={{ fontSize: "3rem", color: "#007bff" }}></i>
            <p style={{ color: "#333", fontSize: "1rem", marginTop: "10px", fontWeight: "500" }}>
              תקשרו עם המתווך בקלות
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <i className="pi pi-clipboard" style={{ fontSize: "3rem", color: "#28a745" }}></i>
            <p style={{ color: "#333", fontSize: "1rem", marginTop: "10px", fontWeight: "500" }}>
              פרסמו מודעה משלכם
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Registration Form */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "right", // נשאר מיושר לימין
          direction: "rtl", // שומר על RTL עבור אלמנט זה
          alignSelf: "flex-start",
        }}
      >
        <h1 style={{ color: "#333", fontSize: "2rem", marginBottom: "20px" }}>הרשמה</h1>
        <p style={{ color: "#555", fontSize: "1rem", marginBottom: "20px" }}>
          <h1> הי, טוב לראות אותך.</h1>
          <h3>מלא את הפרטים כדי ליצור חשבון חדש</h3>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field" style={{ marginBottom: "20px" }}>
            <span className="p-float-label">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames({ "p-invalid": fieldState.invalid })}
                    style={{ width: "100%", textAlign: "right" }}
                  />
                )}
              />
              <label htmlFor="name">שם מלא</label>
            </span>
            {getFormErrorMessage("name")}
          </div>
          <div className="field" style={{ marginBottom: "20px" }}>
            <span className="p-float-label">
              <Controller
                name="username"
                control={control}
                rules={{ required: "שם משתמש הוא שדה חובה." }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.invalid })}
                    style={{ width: "100%", textAlign: "right" }}
                  />
                )}
              />
              <label htmlFor="username">שם משתמש*</label>
            </span>
            {getFormErrorMessage("username")}
          </div>
          <div className="field" style={{ marginBottom: "20px" }}>
            <span className="p-float-label">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "אימייל הוא שדה חובה.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "כתובת אימייל אינה תקינה.",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.invalid })}
                    style={{ width: "100%", textAlign: "right" }}
                  />
                )}
              />
              <label htmlFor="email">אימייל*</label>
            </span>
            {getFormErrorMessage("email")}
          </div>
          <div className="field" style={{ marginBottom: "20px" }}>
            <span className="p-float-label">
              <Controller
                name="password"
                control={control}
                rules={{ required: "סיסמה היא שדה חובה." }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    toggleMask
                    className={classNames({ "p-invalid": fieldState.invalid })}
                    style={{ width: "100%", textAlign: "right" }}
                  />
                )}
              />
              <label htmlFor="password">סיסמה*</label>
            </span>
            {getFormErrorMessage("password")}
          </div>
        
          <Button
            type="submit"
            label="הרשמה"
            className="mt-2"
            style={{
              width: "100%",
              backgroundColor: "#007bff",
              border: "none",
              color: "white",
              padding: "10px",
              fontSize: "1rem",
            }}
          />
          <Button
            type="button"
            label="איפוס"
            onClick={() => reset()}
            className="mt-2 p-button-outlined"
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              fontSize: "1rem",
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default FormReg;