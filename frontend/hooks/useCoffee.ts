import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coffeeApi } from '../services/coffeeApi';
import { CreateCoffeeRequest, UpdateCoffeeRequest } from '../types/coffee';
import { message } from 'antd';

export const useCoffees = () => {
  return useQuery({
    queryKey: ['coffees'],
    queryFn: coffeeApi.getAllCoffees,
  });
};

export const useCoffee = (id: string) => {
  return useQuery({
    queryKey: ['coffee', id],
    queryFn: () => coffeeApi.getCoffeeById(id),
    enabled: !!id,
  });
};

export const useCreateCoffee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: coffeeApi.createCoffee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] });
      message.success('Coffee created successfully!');
    },
    onError: () => {
      message.error('Failed to create coffee');
    },
  });
};

export const useUpdateCoffee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoffeeRequest }) =>
      coffeeApi.updateCoffee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] });
      message.success('Coffee updated successfully!');
    },
    onError: () => {
      message.error('Failed to update coffee');
    },
  });
};

export const useDeleteCoffee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: coffeeApi.deleteCoffee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coffees'] });
      message.success('Coffee deleted successfully!');
    },
    onError: () => {
      message.error('Failed to delete coffee');
    },
  });
};
