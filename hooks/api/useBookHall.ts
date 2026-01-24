import axios from 'axios';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
    const bookHallSchema = z.object({
        bookingDate: z.string(), // "2024-12-25"
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        bookingType: z.string().min(1).default("daily"), // matches booking_type column
    });
    

    type BookHallData = z.infer<typeof bookHallSchema>;
const bookHall = async (hallId: string,data: BookHallData) => {
    
  const response = await axios.post(`http://localhost:8000/api/halls/${hallId}/bookings`,data);
  return response.data;
};

export const useBookHall = (hallId: string,data: any) => {
  return useQuery({
    queryKey: ['bookHall', hallId],
    queryFn: () => bookHall(hallId,data),
  });
};