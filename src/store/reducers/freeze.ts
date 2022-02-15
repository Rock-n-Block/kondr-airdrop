import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSVLine, FreezeElement, FreezeState } from 'types/store';

const initialState: FreezeState = {
  freeze: [],
  complete: [],
  baseFreeze: [],
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
    setFreeze(state, action: PayloadAction<FreezeElement[]>) {
      state.freeze = action.payload.sort((a, b) => +a.available_date - +b.available_date);
    },
    setCollect(state, action: PayloadAction<string>) {
      state.collect = action.payload;
    },
    setBaseFreeze(state, action: PayloadAction<CSVLine[]>) {
      state.baseFreeze = action.payload;
    },
    setComplete(state, action: PayloadAction<FreezeElement[]>) {
      state.complete = action.payload;
    },
  },
});

export default FreezeSlice.reducer;
