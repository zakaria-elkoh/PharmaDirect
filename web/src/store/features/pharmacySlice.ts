import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosResponse } from "axios";
const api: string = "http://localhost:3000";

interface PharState {
  isLoading: boolean;
  pharmacys: any | null;
  error: string | null;
  erros: string | null;
  message: string | null;
  counterPharmacy: number;
}

// Initial state
const initialState: PharState = {
  isLoading: false,
  pharmacys: [],
  error: null,
  erros: null,
  message: null,
  counterPharmacy: 0,
};

export const getAllPharmacy = createAsyncThunk(
  "phar/getAllPharmacy",
  async (_, thunkAPI: any) => {
    try {
      const res = await axios.get(`${api}/pharmacies`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      console.error(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createPharmacy = createAsyncThunk(
  "phar/createPharmacy",
  async (data: any, thunkAPI: any) => {
    console.log(data);

    const dataPharmacy = {
      name: data.name,
      phone: data.phone,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      detailedAddress: data.detailedAddress,
      isOnDuty: false,
      email: data.email,
      description: data.description,
    };

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${api}/pharmacies`, dataPharmacy, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);

      return res.data;
    } catch (error: any) {
      console.error(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const UpdatePassword = createAsyncThunk(
  "phar/UpdatePassword",
  async (data, thunkAPI: any) => {
    try {
      const res = await axios.post(
        `http://localhost:8001/api/auth/resetpassword`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (error: any) {
      console.error(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Create the slice
const pharSlice = createSlice({
  name: "phar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllPharmacy
    builder
      .addCase(getAllPharmacy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPharmacy.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = null;
        state.pharmacys = action.payload.data;
        console.log(action.payload);
      })
      .addCase(getAllPharmacy.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(action.payload.response.data.message);

        state.error = action.payload.response.data.message;
      });

    // createPharmacy
    builder
      .addCase(createPharmacy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPharmacy.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = null;
        state.counterPharmacy += 1;
        console.log(action.payload);
      })
      .addCase(createPharmacy.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(action.payload.response.data.message);

        state.error = action.payload.response.data.message;
      });

    // UpdatePassword
    builder
      .addCase(UpdatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdatePassword.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(UpdatePassword.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(action.payload.response.data.message);

        state.error = action.payload.response.data.message;
      });
  },
});

export default pharSlice.reducer;
