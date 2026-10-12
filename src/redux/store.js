import { configureStore } from "@reduxjs/toolkit";
import  useReducer  from "../redux/slices/userSlice";

export const store = configureStore ({
    reducer:{
user: useReducer
    }
})