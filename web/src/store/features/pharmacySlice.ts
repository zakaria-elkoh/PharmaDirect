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
    const dataPharmacy = {
      name: data.name,
      phone: data.phone,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      detailedAddress: data.detailedAddress,
      isOnDuty: data.isOnDuty,
      email: data.email,
      description: data.description,
      image: data.image,
    };


    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${api}/pharmacies`, dataPharmacy, {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const deletedPharmacy = createAsyncThunk(
  "phar/deletedPharmacy",
  async (id: string, thunkAPI: any) => {
    console.log(id);

    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${api}/pharmacies/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error: any) {
      console.error(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updatePharmacy = createAsyncThunk(
  "phar/updatePharmacy",
  async ({ data, id }: { data: any; id: string }, thunkAPI: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    try {
      const res = await axios.put(`${api}/pharmacies/${id}`, data, {
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

    // deletedPharmacy
    builder
      .addCase(deletedPharmacy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletedPharmacy.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = null;
        state.counterPharmacy += 1;
        state.pharmacys = action.payload.data;
        console.log(action.payload);
      })
      .addCase(deletedPharmacy.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(action.payload.response.data.message);

        state.error = action.payload.response.data.message;
      });

    // updatePharmacy
    builder
      .addCase(updatePharmacy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePharmacy.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = null;
        state.counterPharmacy += 1;
        console.log(action.payload);
      })
      .addCase(updatePharmacy.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(action.payload);

        state.error = action.payload.response.data.message;
      });
  },
});

export default pharSlice.reducer;
