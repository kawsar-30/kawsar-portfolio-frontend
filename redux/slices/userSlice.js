'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: "MD. KAWSAR HOSSAIN",
    role: "Cyber Security Analyst",
    year: "2026",
    status: "OPTIMIZED",
  },
  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-username",
    whatsapp: "https://wa.me/88017XXXXXXXX", 
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   
  }
});

export default userSlice.reducer;