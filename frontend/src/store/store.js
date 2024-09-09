import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '../api/usersApi';
import homeReducer from './homeSlice';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    home: homeReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});