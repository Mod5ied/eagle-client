import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/auth.api';

interface AuthState {
  user: { id: string; email: string } | null;
  status: 'idle' | 'authenticating' | 'authenticated' | 'error';
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.status = 'authenticating';
    });
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.status = 'authenticated';
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state) => {
      state.status = 'error';
    });
    builder.addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.status = 'authenticated';
    });
  },
});

export const { logout } = slice.actions;
export const authReducer = slice.reducer;
