'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API থেকে ডাটা আনার জন্য AsyncThunk
export const fetchCertifications = createAsyncThunk(
  'certifications/fetchCertifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/certifications`);
      const data = await response.json();
      return data.success ? data.data : data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const certificationSlice = createSlice({
  name: 'certifications',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default certificationSlice.reducer;