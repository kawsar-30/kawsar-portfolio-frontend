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
    whatsapp: "https://wa.me/88017XXXXXXXX", // তোমার নম্বর বসাও
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // এখানে ভবিষ্যতে ডাটা আপডেট করার ফাংশন চাইলে লিখতে পারো
  }
});

export default userSlice.reducer;