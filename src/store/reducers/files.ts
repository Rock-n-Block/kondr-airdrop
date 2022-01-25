import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSVLine, FileState } from 'types/store';

const initialState: FileState = {
  files: null,
  file: null,
  isLoading: false,
  errorList: [],
};

export const FileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setFiles(state, action: PayloadAction<CSVLine[]>) {
      state.files = action.payload;
    },
    setError(state, action: PayloadAction<string[]>) {
      state.errorList = action.payload;
    },
    setFile(state, action: PayloadAction<File | null>){
      state.file = action.payload;
    }
  },
});

export default FileSlice.reducer;
