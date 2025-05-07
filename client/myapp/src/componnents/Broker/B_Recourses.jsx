// import { useEffect, useState } from "react"
// import axios from 'axios'
// import ShowRecourse from "./ShowRecourse"
// import { jwtDecode } from 'jwt-decode';
// import { useSelector } from 'react-redux'; // ייבוא useSelector

// const B_Recourses =  () => {
//     const [recoursesData, setrecoursesData] = useState([])
//     const[visible,setVisible]=useState(false)
//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;
//     debugger

   
//     const getRecourses = async () => {
       
//             try {
                
//                 const res = await axios(
//                     {
//                         method:'GET',
//                         url:'http://localhost:7002/api/recourse/getAllRecourse',
//                         headers:{Authorization: "Bearer " + accesstoken}
                        
//                     }
//                 )
//             if (res.status === 200) {
//                 console.log(res.data);
//                 setrecoursesData(res.data)
//             }
//             //  debugger
//         } catch (e) {
//             console.error(e)
//         }
//     }
//     useEffect(() => {
//         getRecourses()
//     }, [])
//     return (
  
//         <>  
//         <ShowRecourse recoursesData={recoursesData} setrecoursesData={setrecoursesData} getRecourses={getRecourses}></ShowRecourse>
       
//           {/* {  recoursesData.map((recourse)=> (<ShowRecourse recourse={recourse} setrecoursesData={setrecoursesData} getRecourses={getRecourses}></ShowRecourse> */}

//             {/* ))} */}
//             {/* { recoursesData.map((recourse) => (
//     <ShowRecourse 
//         key={recourse.id} // Ensure to provide a unique key if applicable
//         recourse={recourse} 
//         setrecoursesData={setrecoursesData} 
//         getRecourses={getRecourses} 
//     />
// ))} */}
     
          
           
        
//         </>
//     )    
// }
// export default B_Recourses