export interface Coffee {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoffeeRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  available?: boolean;
}

export interface UpdateCoffeeRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  available?: boolean;
}
