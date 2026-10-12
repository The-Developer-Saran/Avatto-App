import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    userName : null,

}

const userSlice = createSlice({
name : 'User',
initialState,
reducers : {
    setuserName: (state,action)=>{state.userName = action.payload},
    clearuserName: (state)=>{state.userName = null}
}
});

export const {setuserName,clearuserName}=userSlice.actions;
export default userSlice.reducer;