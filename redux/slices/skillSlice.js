'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
     
      const response = await fetch(`${API_URL}/skills`);
      const data = await response.json();
      
     
      return data.success ? data.data : data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const skillSlice = createSlice({
  name: 'skills',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default skillSlice.reducer;