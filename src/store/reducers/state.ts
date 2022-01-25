import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  state: 0,
};

export const StateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<number>) {
      state.state = action.payload;
    },
  },
});

export default StateSlice.reducer;
