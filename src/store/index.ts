import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth.slice';
import { productsReducer } from './slices/products.slice';
import { authApi } from './services/auth.api';
import { productsApi } from './services/products.api';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(authApi.middleware, productsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
