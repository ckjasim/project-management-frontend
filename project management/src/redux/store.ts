import {configureStore} from "@reduxjs/toolkit"
import authReducer from './features/auth/authSlice';
import chatReducer from './features/chat/chatSlice';

const store=configureStore({
    reducer:{
        Auth:authReducer,
        chat:chatReducer
    
      }
})


export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
export default store