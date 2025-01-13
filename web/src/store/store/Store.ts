import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import pharSlice from "../features/pharmacySlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    phar: pharSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
