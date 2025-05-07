
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllUsers = () => {

    const accesstoken = useSelector((state) => state.token.token);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);


    const rightToolbarTemplate = () => {
        return <Button label="יצוא" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0"></h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="חיפוש..." />
            </IconField>
        </div>
    );

  

    useEffect(() => {
        debugger
        const fetchUsers = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:7002/api/users/getAllUsers',
                    headers: { Authorization: "Bearer " + accesstoken.token },
                });

                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [accesstoken]);
    console.log(users)
    
    
    const exportCSV = () => {
        if (dt.current) {
            dt.current.exportCSV(); // ייצוא הנתונים בקובץ CSV
        }
    };
    
 
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4"  right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    ref={dt}
                    value={users}
                    selection={selectedUsers}
                    onSelectionChange={(e) => setSelectedUsers(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="שם" ></Column>
                    <Column field="username" header="שם משתמש"></Column>
                    <Column field="email" header="אימייל" ></Column>
                    <Column field="roles" header="סוג" ></Column>
                    <Column
                        body={(rowData) => (
                            <React.Fragment>
                           
                                {/* <Button
                                    icon="pi pi-comments"
                                    rounded
                                    outlined
                                    className="mr-2"
                                    tooltip="פתח צ'אט"
                                    onClick={() => navigate(`/chat?userId=${rowData._id}`)}
                                /> */}
                            </React.Fragment>
                        )}
                        exportable={false}
                        style={{ minWidth: '12rem' }}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default AllUsers;