import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import skillReducer from './slices/skillSlice'; 
import serviceReducer from './slices/serviceSlice';
import certificationReducer from './slices/certificationSlice';



export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    skills: skillReducer, 
    services: serviceReducer,
    certifications: certificationReducer,
  },
});