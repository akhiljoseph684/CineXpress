import {
  createSlice
} from "@reduxjs/toolkit";

const initialState = {

  user: undefined,

  accessToken: null,

  loading: true,

};

const authSlice =
  createSlice({

    name: "auth",

    initialState,

    reducers: {

      setCredentials:
        (state, action) => {

          state.user =
            action.payload.user;

          state.accessToken =
            action.payload.accessToken;

          state.loading = false;
        },

      updateUser:
        (state, action) => {

          state.user = {

            ...state.user,

            ...action.payload

          };

        },

      logout:
        (state) => {

          state.user = null;

          state.accessToken = null;

          state.loading = false;
        },

    }

});

export const {

  setCredentials,

  logout,

  updateUser

} = authSlice.actions;

export default authSlice.reducer;