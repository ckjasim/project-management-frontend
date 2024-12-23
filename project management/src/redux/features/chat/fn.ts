import { PayloadAction } from '@reduxjs/toolkit';

// Reducer function to update the state
export const setChat = (
  state: { currentRoom: string | undefined; chatMode: string | undefined;name: string | undefined ;url: string | undefined},
  action: PayloadAction<{ currentRoom: string; chatMode: string;name: string;url:string }>
) => {
  state.currentRoom = action.payload.currentRoom;
  state.chatMode = action.payload.chatMode;
  state.name = action.payload.name;
  state.url = action.payload.url;
};
