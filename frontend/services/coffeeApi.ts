import axios from "axios";
import {
  Coffee,
  CreateCoffeeRequest,
  UpdateCoffeeRequest,
} from "../types/coffee";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const coffeeApi = {
  getAllCoffees: async (): Promise<Coffee[]> => {
    const response = await api.get("");
    const data = response.data;

    console.log("API Response:", data);

    if (data && data.data && Array.isArray(data.data.coffees)) {
      return data.data.coffees;
    }

    return [];
  },

  getCoffeeById: async (id: string): Promise<Coffee> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  createCoffee: async (coffee: CreateCoffeeRequest): Promise<Coffee> => {
    const response = await api.post("", coffee);
    return response.data;
  },

  updateCoffee: async (
    id: string,
    coffee: UpdateCoffeeRequest
  ): Promise<Coffee> => {
    const response = await api.put(`/${id}`, coffee);
    return response.data;
  },

  deleteCoffee: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
