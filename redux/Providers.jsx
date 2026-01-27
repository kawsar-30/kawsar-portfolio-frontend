'use client' 

import { Provider } from 'react-redux';
import { store } from './store'; // নিশ্চিত করো পাথটি ঠিক আছে (একই ফোল্ডারে থাকলে ./store)

/**
 * এই ফাইলটি একটি ক্লায়েন্ট কম্পোনেন্ট হিসেবে কাজ করবে যা 
 * অ্যাপের সব চাইল্ড কম্পোনেন্টকে রেডক্স স্টোর এক্সেস করতে দেয়।
 */
export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}