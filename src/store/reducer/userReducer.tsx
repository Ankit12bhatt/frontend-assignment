/**
 * Redux slice for managing authentication state.
 * @remarks This slice handles authentication-related state such as authentication status and user information.
 */


import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
type AuthState = {
  loading: boolean;
  user: User | null;
};

type User = {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed (e.g., role, avatar, etc.)
};

// Initial state
const initialState: AuthState = {
  loading: true,
  user: null,
};

// Create authentication slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Action to log in the user.
     * @param state - Current authentication state.
     * @param action - Payload containing user information.
     */

    logIn: (_state, action: PayloadAction<{ token: string }>) => {
      localStorage.setItem("token", action.payload.token);
    },

    /**
     * Action to log out the user.
     * @param state - Current authentication state.
     */

    logOut: (state) => {
      state.loading = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    
    setLoadingUser: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      localStorage.removeItem('user')
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

// Export actions
export const {
  logIn,
  logOut,
  setUser,
  setLoadingUser,
} = authSlice.actions;

/**
 * Selector function to get the authentication state.
 * @param state - Redux store state.
 * @returns Authentication state.
 */

export default authSlice.reducer;