import { Card } from 'primereact/card';
import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { SpeedDial } from 'primereact/speeddial';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';
// import { useRouter } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
// import './ShowRecourse.css';
import { OrderList } from 'primereact/orderlist';
        
        

const ShowRecourse=(props)=>{
    const[visible,setVisible]=useState(false)
    const [products, setProducts] = useState([]);
    const updateRecourse = async () => {
        try {
            // const Id = props.todo._id
           const res = await axios.put(`http://localhost:7002/api/recourse/update`)
            if (res.status === 200) {
                props.setrecoursesData(res.data)
                props.getRecourses()
            }
        }
        catch (e) {
            console.error(e);
        }
    }
   
  
    const footer = (
        <> 
        {/* <Button label="Complete" onClick={()=>{updateRecourse()}} icon={props.recourse.complete===false?"pi pi-times":"pi pi-check"}  style={{ marginLeft: '0.5em',width:"31%" ,fontSize:"11px",backgroundColor:'#F9D216' }}/> */}
        {/* <Button label="Delete"  onClick={() => { deleteTodo() }} severity="secondary" icon="pi pi-trash" style={{ marginLeft: '0.5em',width:"31%" ,fontSize:"11px",backgroundColor:'#F50055' }} /> */}
        {/* <Button label="Update" onClick={() => {setVisible(true) }} severity="secondary" icon="pi pi-pencil" style={{ marginLeft: '0.5em',width:"31%" ,fontSize:"11px" ,backgroundColor:'#36ADCC'}} />  */}
        {/* { visible && <UpdateTodo setTodosData={props.setTodosData} setVisible={setVisible} visible={visible} todo={props.todo} getTodos={props.getTodos} />} */}
        </>
    );
    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} alt={item.name} />
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.category}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.price}</span>
            </div>
        );
    };

    return (
        // <div className="card flex justify-content-center">
             
        //     <Card  footer={footer} className="md:w-25rem">
        //        {props.recourse.contact}
        //     {/* {props.recourse.contact.map(t=><>{t}</>)} */}
        //     {/* title={props.todo.title} */}
        //     {/* {props.todo.tags.map(t=><><br></br>{t}</>)} */}
         
        //     </Card>
        // </div>
        <div className="card xl:flex xl:justify-content-center">
            <OrderList dataKey="id" value={props.recoursesData.contact} itemTemplate={itemTemplate} header="Products"></OrderList>
        </div>
        
    )
}

export default ShowRecourse