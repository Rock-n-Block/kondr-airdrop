import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FreezeElement, FreezeState } from 'types/store';

const initialState: FreezeState = {
  freeze: [],
  collect: '0',
  isLoading: false,
};

export const FreezeSlice = createSlice({
  name: 'freeze',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setFreeze(state, action: PayloadAction<FreezeElement>){
        state.freeze = [...state.freeze, action.payload];
    },
    setCollect(state, action: PayloadAction<string>){
      state.collect = action.payload;
    }
  },
});

export default FreezeSlice.reducer;