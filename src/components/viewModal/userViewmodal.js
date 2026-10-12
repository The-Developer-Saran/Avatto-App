// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { setuserName } from '../../redux/slices/userSlice'
// import { userViewmodal } from "../viewModal/userViewmodal";



// export const userViewmodal = () => {

//     const dispatch =useDispatch();
 
//       const User_Details = async () => {
    
//         await axios.get(`https://sparkredeem.com/sparky/laravel/api/profile_data/1227`)
//           .then(response => {
//             const data = response?.data;
//             console.log("data",data)
    
//             if (data?.Response.Success == '1') {
//                 const userName = data.Response.Result[0]?.name; // Safely access the name
//                 dispatch(setuserName(userName)); // Dispatch to Redux
//                  console.log("RES ;", data.Response);
//             }
    
    
//             else {
//               console.log(data?.Response.Message);
          
    
//             }
//           })
//           .catch(error => {
    
//             console.log(data?.Response.Message);
//           });
    
//       }


//       return{
//         User_Details
//       }

// }



