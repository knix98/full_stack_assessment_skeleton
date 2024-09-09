import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showErrorPage: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShowErrorPage(state, action) {
      state.showErrorPage = action.payload;
    }
  },
});

export const {
  setShowErrorPage,
} = appSlice.actions;

export default appSlice.reducer;