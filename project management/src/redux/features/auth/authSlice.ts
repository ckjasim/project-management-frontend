import {createSlice} from "@reduxjs/toolkit"
import { TUser } from "./type";
import { logoutUser, setUser } from "./fn";


const user=window.localStorage.getItem("user") || ""

const initialState:{userInfo:TUser }={
    userInfo:user?JSON.parse(user):undefined,
}

const authSlice =createSlice({
  name:"auth",
  initialState,
  reducers:{
    SetUser:setUser,
    LogoutUser:logoutUser
  },
  extraReducers: (builder) => {
    builder.addCase('LOGOUT', () => initialState); 
  },
})

export const {SetUser,LogoutUser}=authSlice.actions
export default authSlice.reducer