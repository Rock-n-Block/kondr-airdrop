import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSVLine, FreezeElement, FreezeState } from 'types/store';

import { normalizedValue } from 'utils';

const initialState: FreezeState = {
  freeze: [],
  complete: [],
  pending: [],
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
      state.freeze = action.payload
        .sort((a, b) => +a.available_date - +b.available_date)
        .map((f) => ({ ...f, amount: normalizedValue(f.amount).toString() }));
    },
    setCollect(state, action: PayloadAction<string>) {
      state.collect = action.payload;
    },
    setBaseFreeze(state, action: PayloadAction<CSVLine[]>) {
      state.baseFreeze = action.payload.map((f) => ({
        ...f,
        amount: normalizedValue(f.amount).toString(),
      }));
    },
    setComplete(state, action: PayloadAction<FreezeElement[]>) {
      state.complete = action.payload.map((f) => ({
        ...f,
        amount: normalizedValue(f.amount).toString(),
      }));
    },
    setPending(state, action: PayloadAction<FreezeElement[]>) {
      state.pending = action.payload.map((f) => ({
        ...f,
        amount: normalizedValue(f.amount).toString(),
      }));
    },
  },
});

export default FreezeSlice.reducer;
