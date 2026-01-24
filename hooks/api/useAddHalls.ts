import axios from 'axios';
import z from 'zod';
const addHallSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
    price_per_day: z.number().min(0),
    price_per_hour: z.number().min(0).optional(),
    capacity: z.number().min(0),
    address: z.string().min(3),
    city: z.string().min(2),
    original_price: z.number().min(0).optional(),
    services: z.array(z.string()),
    rules: z.array(z.string()),
    amenities: z.array(z.string()),
    images: z.array(z.string()),
  });
  type AddHallForm = z.infer<typeof addHallSchema>;
export const useAddHalls = () => {
  const addHall = async (data: AddHallForm) => {
    try {
        const response = await axios.post('http://localhost:8000/api/company/halls', data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
  return { addHall };
};