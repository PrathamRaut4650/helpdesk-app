import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token: localStorage.getItem("token") || null,
};
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setToken:(state, action)=>{
            state.token =action.payload;
        },
        logout: (state) => {
  state.token = null;

  localStorage.removeItem("token");
  localStorage.removeItem("role");
},
    },
})
export const {setToken, logout} = authSlice.actions;
export default authSlice.reducer;