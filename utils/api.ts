import { authClient } from '@/lib/auth';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  },
});