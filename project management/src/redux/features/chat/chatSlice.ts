import { createSlice } from '@reduxjs/toolkit';

import { setChat } from './fn';

const initialState: {
  currentRoom: string | undefined;
  chatMode: string | undefined;
  name: string | undefined;
} = {
  currentRoom: undefined,
  chatMode: undefined,
  name: undefined,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    SetChat: setChat,
  },
});

export const { SetChat } = chatSlice.actions;
export default chatSlice.reducer;