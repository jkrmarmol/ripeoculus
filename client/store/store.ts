import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from '@/store/auth/authenticationSlice';
import ripeReducer from '@/store/ripeSlice';
import profileReducer from '@/store/profileSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authentication: authenticationReducer,
      ripe: ripeReducer,
      profile: profileReducer
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
